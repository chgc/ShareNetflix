import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [':host {display: block; width: 400px;}']
})
export class AppComponent {}
