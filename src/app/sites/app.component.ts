import { HttpClient } from '@angular/common/http';
import { Component, OnInit, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { Video, GenresDisplay } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, shareReplay, tap, switchMap, scan } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import memo from 'memo-decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  videos$: Observable<Video[]>;
  genres$: Observable<GenresDisplay[]> = this.http
    .get('assets/data.json')
    .pipe(map(data => data['genres']), shareReplay());
  triggerSearch$ = new BehaviorSubject([]);
  searchDiffer: KeyValueDiffer<any, any>;

  private query = {
    limit: 9
  };
  private data = new BehaviorSubject({ data: [], needReset: false });
  private more = new BehaviorSubject(false);
  private genresSet = new Set();
  constructor(private differs: KeyValueDiffers, private db: AngularFirestore, private http: HttpClient) {}

  ngOnInit() {
    this.searchDiffer = this.differs.find(this.genres).create();
    this.initDataset();
    this.videos$ = this.data.pipe(
      scan((acc: Video[], value: { data; needReset }) => {
        if (value.needReset) {
          return [...value.data];
        }
        return [...acc, ...value.data];
      }, []),
      shareReplay()
    );
  }

  trackByFn(index, item: Video) {
    return item.id;
  }

  genreFilter(genre) {
    this.genresSet.add(genre);
    this.triggerSearch$.next(this.genres);
  }

  removeFilter(genre) {
    this.genresSet.delete(genre);
    this.triggerSearch$.next(this.genres);
  }

  get genres() {
    return Array.from(this.genresSet);
  }

  get loadMoreDisable() {
    return this.data.value.data.length < this.query.limit;
  }

  loadMore() {
    this.more.next(true);
  }

  private initDataset() {
    let needReset = false;
    let cursor = null;
    combineLatest(this.triggerSearch$, this.more)
      .pipe(
        switchMap(([filters, more]) => {
          return this.db
            .collection<Video>('videos', ref => {
              let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
              needReset = this.searchDiffer.diff(filters) !== null ? true : false;

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
        }),
        mergeMap(videos => {
          return this.genres$.pipe(
            map(genres =>
              videos.map(video => {
                cursor = video.payload.doc;
                return {
                  ...video.payload.doc.data(),
                  genresDisplay: Object.keys(video.payload.doc.data().genres)
                    .map(id => this.getGenresDisplay(id, genres))
                    .filter(x => x)
                };
              })
            )
          );
        }),
        map(videos => videos.sort((a: Video, b: Video) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))),
        tap(videos => {
          cursor = videos.length === 0 ? null : cursor;
          this.data.next({ data: videos, needReset });
          needReset = false;
        })
      )
      .subscribe();
  }

  @memo()
  private getGenresDisplay(id, genres) {
    return genres.filter(genre => genre.id === id)[0];
  }
}
