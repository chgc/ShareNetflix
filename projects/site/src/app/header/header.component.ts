import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenresDisplay } from '@models/video';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() genres;
  @Output() remove: EventEmitter<GenresDisplay> = new EventEmitter();

  removeFilter(genre) {
    this.remove.emit(genre);
  }
}
