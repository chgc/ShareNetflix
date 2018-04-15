import { Component, OnInit } from '@angular/core';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  getTab$ = bindCallback(chrome.tabs.get);
  tabId$ = new Subject<number>();
  ngOnInit() {
    chrome.tabs.onActivated.addListener(this.checkPageActionState.bind(this, 'activated'));
    chrome.tabs.onUpdated.addListener(this.checkPageActionState.bind(this, 'updated'));

    this.tabId$.pipe(mergeMap(id => this.getTab$(id))).subscribe(tabInfo => {
      if (tabInfo && tabInfo.url.match(/www\.netflix\.com\/(title|watch)\/\d+/)) {
        chrome.pageAction.show(tabInfo.id);
      } else {
        chrome.pageAction.hide(tabInfo.id);
      }
    });
  }

  checkPageActionState(name, obj) {
    const tabId = typeof obj === 'number' ? obj : obj.tabId;
    this.tabId$.next(tabId);
  }
}
