import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { EventPageService } from '../event-page.service';
import { Observable } from 'rxjs/Observable';
import { Video } from '@models/video';
import { Comment } from '@models/comment';

const mockData = {
  id: '80178687',
  title: '黑閃電',
  summary: '家人遭到一幫歹徒威脅後，學校校長兼收山的超級英雄傑弗森·皮爾斯再次迅速行動，化身為傳奇人物黑閃電。',
  bgImages: 'https://occ-0-1077-2219.1.nflxso.net/art/85c06/94902a1fbfac64496b110ce690fab014e8185c06.webp',
  releaseYear: 2018,
  episode: 11,
  session: 1,
  numSeasonsLabel: '1 季',
  runtime: 8100
};

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  video = mockData;
  comment = '';
  private itemsCollection: AngularFirestoreCollection<Video>;
  private commentsCollection: AngularFirestoreCollection<Comment>;

  constructor(private eventPageService: EventPageService, private cd: ChangeDetectorRef, private db: AngularFirestore) {
    this.itemsCollection = this.db.collection<Video>('lists');
    this.commentsCollection = this.db.collection<Comment>('comments');
  }

  ngOnInit() {
    this.addListner();
    this.requestVideoInfo();
  }

  share() {
    const postData = { ...this.video, updateDate: new Date() };
    this.itemsCollection.doc(postData.id).set(postData, { merge: true });
    this.commentsCollection
      .doc(postData.id)
      .collection('comments')
      .add({ id: this.db.createId(), comment: this.comment })
      .then(() => {
        this.comment = '';
      });
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
