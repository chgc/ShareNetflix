import { HttpClient } from '@angular/common/http';
import { Injectable, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { GenresDisplay, Video } from '@models/video';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import memo from 'memo-decorator';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, mergeMap, scan, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class VideoStoreService {
  videos$: Observable<Video[]>;
  genres$ = new BehaviorSubject([]);
  canLoadMore$ = new BehaviorSubject(true);
  private genresDB$: Observable<GenresDisplay[]> = this.http
    .get('assets/data.json')
    .pipe(map(data => data['genres']), shareReplay());
  private searchDiffer: KeyValueDiffer<any, any>;
  private query = {
    limit: 30
  };
  private data$ = new BehaviorSubject({ data: [], needReset: false });
  private more$ = new BehaviorSubject(false);
  private genresSet = new Set();

  constructor(private differs: KeyValueDiffers, private db: AngularFirestore, private http: HttpClient) {
    this.searchDiffer = this.differs.find(this.genres).create();
    this.initDataset();
    this.videos$ = this.data$.pipe(
      scan((acc: Video[], value: { data; needReset }) => value.needReset ? [...value.data] : [...acc, ...value.data], []),
      shareReplay()
    );
  }

  addGenreFilter(genre) {
    if (this.genresSet.size !== this.genresSet.add(genre).size) {
      this.genres$.next(this.genres);
    }
  }

  removeGenreFilter(genre) {
    this.genresSet.delete(genre);
    this.genres$.next(this.genres);
  }

  loadMore() {
    this.more$.next(true);
  }

  private initDataset() {
    let needReset = false;
    let cursor = null;
    combineLatest(this.genres$, this.more$)
      .pipe(
        switchMap(([filters, more]) => {
          needReset = this.searchDiffer.diff(filters) !== null ? true : false;
          return this.queryFirebase(filters, more, needReset, cursor);
        }),
        mergeMap(videos => {
          videos.map(video => {
            cursor = video.payload.doc;
          });
          return this.addAdditionProperty(videos);
        }),
        map(videos => videos.sort((a: Video, b: Video) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))),
        tap(videos => {
          cursor = videos.length === 0 ? null : cursor;
          this.canLoadMore$.next(videos.length < this.query.limit);
          this.data$.next({ data: videos, needReset });
          needReset = false;
        })
      )
      .subscribe();
  }

  private queryFirebase(filters, more, needReset, cursor) {
    return this.db
      .collection<Video>('videos', ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

        filters.forEach(genre => {
          query = query.where(`genres.${genre.id}`, '==', true);
        });
        if (filters.length === 0) {
          query = query.orderBy('likes', 'desc');
        }

        query = query.limit(this.query.limit);
        if (!needReset && more) {
          query = query.startAfter(cursor);
        }
        return query;
      })
      .snapshotChanges();
  }

  private addAdditionProperty(videos) {
    return this.genresDB$.pipe(
      map(genres =>
        videos.map(video => {
          return {
            ...video.payload.doc.data(),
            genresDisplay: Object.keys(video.payload.doc.data().genres)
              .map(id => this.getGenresDisplay(id, genres))
              .filter(x => x)
          };
        })
      )
    );
  }
  private get genres() {
    return Array.from(this.genresSet);
  }

  @memo()
  private getGenresDisplay(id, genres) {
    return genres.filter(genre => genre.id === id)[0];
  }
}
