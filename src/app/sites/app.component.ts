import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Video, GenresDisplay } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap, shareReplay, tap, switchMap } from 'rxjs/operators';
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

  private genresSet = new Set();
  constructor(private db: AngularFirestore, private http: HttpClient) { }

  ngOnInit() {
    this.initDataset();
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

  private initDataset() {
    this.videos$ = this.triggerSearch$.pipe(
      switchMap((filters) => {
        return this.db.collection<Video>('videos', ref => {
          let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (filters) {
            filters.forEach(genre => {
              query = query.where(`genres.${genre.id}`, "==", true);
            })
          } else {
            query = query.orderBy('likes', 'desc')
          }
          return query;
        }).valueChanges();
      }),
      mergeMap(videos => {
        return this.genres$.pipe(
          map(genres =>
            videos.map(video => ({
              ...video,
              genresDisplay: Object.keys(video.genres).map(id => this.getGenresDisplay(id, genres)).filter(x => x)
            }))
          )
        );
      }),
      map(videos => videos.sort((a: Video, b: Video) =>
        a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0
      )),
      shareReplay()
    );
  }

  @memo()
  private getGenresDisplay(id, genres) {
    return genres.filter(genre => genre.id === id)[0];
  }
}
