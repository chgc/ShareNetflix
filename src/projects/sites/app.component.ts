import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: 'Websites<router-outlet></router-outlet>',
  styles: [':host {display: block; width: 400px;}']
})
export class AppComponent {
  constructor(title: Title) {
    title.setTitle('SharedNetflix Website');
  }
}
