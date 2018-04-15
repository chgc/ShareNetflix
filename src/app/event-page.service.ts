/// <reference types="chrome/chrome-app"/>

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { bindCallback } from 'rxjs/observable/bindCallback';

@Injectable()
export class EventPageService {
  currentTab: chrome.tabs.Tab;
  getSelectedTab: Observable<chrome.tabs.Tab[]>;
  onMessage$: Observable<{ request; sender; response }>;
  constructor() {
    this.initBrowserAction();
    this.onMessage();
  }

  initBrowserAction() {
    if (typeof chrome.tabs !== 'undefined') {
      this.getSelectedTab = bindCallback<chrome.tabs.Tab[]>(chrome.tabs.query)({ active: true });
    }
  }

  onMessage() {
    if (typeof chrome.runtime !== 'undefined') {
      this.onMessage$ = bindCallback<{ request; sender; response }>(
        chrome.runtime.onMessage.addListener,
        (request, sender, response) => ({ request, sender, response })
      )();
    }
  }
}
