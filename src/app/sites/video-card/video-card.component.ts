import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Video, GenresDisplay } from '@models/video';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCardComponent {
  @Input() video: Video;
  @Output() filter: EventEmitter<GenresDisplay> = new EventEmitter();
  goto(id) {
    if (!id) {
      return;
    }
    window.open(`https://www.netflix.com/title/${id}`);
  }

  setFilter(genre) {
    this.filter.emit(genre);
  }
}
