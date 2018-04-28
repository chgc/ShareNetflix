import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Video } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  videoCollections: AngularFirestoreCollection<Video>;
  videos$: Observable<Video[]>;
  constructor(title: Title, private db: AngularFirestore) {
    title.setTitle('SharedNetflix Website');
    this.videoCollections = this.db.collection<Video>('videos');
    this.videos$ = this.videoCollections.valueChanges();
  }

  goto(id) {
    if (!id) {
      return;
    }
    window.open(`https://www.netflix.com/title/${id}`);
  }

  trackByFn(index, item: Video) {
    return item.id;
  }
}
