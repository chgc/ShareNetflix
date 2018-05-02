/// <reference types="chrome/chrome-app"/>
import { Injectable } from '@angular/core';
import { Observable, bindCallback } from 'rxjs';

@Injectable()
export class EventPageService {
  queryTabs: Observable<chrome.tabs.Tab[]>;

  constructor() {
    this.initBrowserAction();
  }

  initBrowserAction() {
    if (typeof chrome.tabs !== 'undefined') {
      this.queryTabs = bindCallback(chrome.tabs.query)({ active: true });
    }
  }
}
