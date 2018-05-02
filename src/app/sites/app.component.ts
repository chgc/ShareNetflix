import { Component } from '@angular/core';
import { Video } from '@models/video';
import { VideoStoreService } from '@sites/video-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  videos$ = this.videoStore.videos$;
  genres$ = this.videoStore.genres$;
  canLoadMore$ = this.videoStore.canLoadMore$;
  constructor(public videoStore: VideoStoreService) {}

  trackByFn(index, item: Video) {
    return item.id;
  }

  addGenreFilter(genre) {
    this.videoStore.addGenreFilter(genre);
  }

  removeGenreFilter(genre) {
    this.videoStore.removeGenreFilter(genre);
  }

  loadMore() {
    this.videoStore.loadMore();
  }
}
