import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Video, GenresDisplay } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import memo from 'memo-decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  videoCollections: AngularFirestoreCollection<Video>;
  videos$: Observable<Video[]>;
  genres$: Observable<GenresDisplay[]> = this.http
    .get('assets/data.json')
    .pipe(map(data => data['genres']), shareReplay());

  private genresSet = new Set();
  constructor(private db: AngularFirestore, private http: HttpClient) {}

  ngOnInit() {
    this.initDataset();
  }

  trackByFn(index, item: Video) {
    return item.id;
  }

  genreFilter(genre) {
    this.genresSet.add(genre);
  }

  get genres() {
    return Array.from(this.genresSet);
  }

  private initDataset() {
    this.videoCollections = this.db.collection<Video>('videos', ref => ref.orderBy('likes', 'desc'));

    this.videos$ = this.videoCollections.valueChanges().pipe(
      mergeMap(videos => {
        return this.genres$.pipe(
          map(genres =>
            videos.map(video => ({
              ...video,
              genresDisplay: video.genres.map(id => this.getGenresDisplay(id, genres)).filter(x => x)
            }))
          )
        );
      }),
      shareReplay()
    );
  }

  @memo()
  private getGenresDisplay(id, genres) {
    return genres.filter(genre => +genre.id === id)[0];
  }
}
