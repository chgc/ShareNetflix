import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Video } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { distinct, mergeMap, pluck, shareReplay, filter, map, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  videoCollections: AngularFirestoreCollection<Video>;
  videos$: Observable<Video[]>;
  genres$: Observable<any[]>;
  constructor(title: Title, private db: AngularFirestore, private http: HttpClient) {
    title.setTitle('SharedNetflix Website');
  }

  ngOnInit() {
    this.initDataset();
  }

  trackByFn(index, item: Video) {
    return item.id;
  }

  private initDataset() {
    this.videoCollections = this.db.collection<Video>('videos', ref => ref.orderBy('likes', 'desc'));
    this.videos$ = this.videoCollections.valueChanges().pipe(shareReplay());
    this.genres$ = this.videos$.pipe(this.pullGenresInformation(), shareReplay());
  }

  private pullGenresInformation() {
    return (obs: Observable<Video[]>) =>
      obs.pipe(
        map(videos =>
          Array.from(
            videos.reduce((acc, curr) => {
              curr.genres.forEach(i => acc.add(i));
              return acc;
            }, new Set())
          )
        ),
        mergeMap(genres => {
          return this.http.get('assets/data.json').pipe(
            map(data => {
              return data['genres'].filter(item => genres.indexOf(+item.id) > -1);
            })
          );
        })
      );
  }
}
