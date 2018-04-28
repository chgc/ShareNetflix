import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Video } from '@models/video';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCardComponent {
  @Input() video: Video;
  goto(id) {
    if (!id) {
      return;
    }
    window.open(`https://www.netflix.com/title/${id}`);
  }
}
