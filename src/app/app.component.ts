import { Component, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { EventPageService } from './event-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  tab;
  video;

  constructor(private eventPageService: EventPageService, private cd: ChangeDetectorRef) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'GOT_RESULT') {
        console.log(message);
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
        this.tab = tabs;
        this.cd.detectChanges();
        const netflixPage = tabs.filter(x => x.url && x.url.indexOf('netflix') > -1);
        if (netflixPage.length > 0) {
          const tabId = netflixPage[0].id;
          chrome.tabs.sendMessage(tabId, { action: 'GET_RESULT' });
        }
      });
    }
  }
}
