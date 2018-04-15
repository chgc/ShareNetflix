import { Component, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { EventPageService } from '../event-page.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements AfterViewInit {
  title = 'app';
  video;

  constructor(private eventPageService: EventPageService, private cd: ChangeDetectorRef) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'GOT_RESULT') {
        this.video = message.payload;
        this.cd.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.getCurrentUrl();
  }

  getCurrentUrl() {
    if (this.eventPageService.getSelectedTab !== undefined) {
      this.title = 'getSelectedTab';
      this.eventPageService.getSelectedTab.forEach(tabs => {
        tabs.forEach(tab => {
          const tabId = tab.id;
          if (tab.url && tab.url.indexOf('netflix') > -1) {
            chrome.pageAction.show(tabId);
            chrome.tabs.sendMessage(tabId, { action: 'GET_RESULT' });
          } else {
            chrome.pageAction.hide(tabId);
            // chrome.browserAction.disable(tab.id);
          }
        });
      });
    }
  }
}
