import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { mergeMap } from 'rxjs/operators';

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

  private checkPageActionState(name, obj, ...rest) {
    switch (name) {
      case 'updated':
        if (rest[0] && 'status' in rest[0] && rest[0].status === 'complete') {
          this.tabId$.next(obj);
        }
        break;
      case 'activated':
        this.tabId$.next(obj.tabId);
        break;
    }
  }
}
