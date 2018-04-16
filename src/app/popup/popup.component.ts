import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { EventPageService } from '../event-page.service';

const mockData = {
  bgImages: 'https://occ-0-1077-2219.1.nflxso.net/art/85c06/94902a1fbfac64496b110ce690fab014e8185c06.webp',
  episode: 11,
  id: '80178687',
  releaseYear: 2018,
  runtime: 0,
  session: 1,
  numSeasonsLabel: '1 季',
  summary: '家人遭到一幫歹徒威脅後，學校校長兼收山的超級英雄傑弗森·皮爾斯再次迅速行動，化身為傳奇人物黑閃電。',
  title: '黑閃電'
};

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  video = mockData;

  constructor(private eventPageService: EventPageService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.addListner();
    this.requestVideoInfo();
  }

  private addListner() {
    if (typeof chrome.runtime.onMessage !== 'undefined') {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'GOT_RESULT') {
          this.video = message.payload;
          this.cd.detectChanges();
        }
      });
    }
  }

  private requestVideoInfo() {
    if (this.eventPageService.queryTabs !== undefined) {
      this.eventPageService.queryTabs.subscribe(tabs => {
        tabs.forEach(tab => {
          if (tab.url && tab.url.match(/www\.netflix\.com\/(title|watch)\/\d+/)) {
            chrome.tabs.sendMessage(tab.id, { action: 'GET_RESULT' });
          }
        });
      });
    }
  }
}
