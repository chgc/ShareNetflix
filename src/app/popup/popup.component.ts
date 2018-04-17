import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShareDetails } from '@models/shareDetails';
import { Video } from '@models/video';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../auth.service';
import { EventPageService } from '../event-page.service';

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
  uid;
  private itemsCollection: AngularFirestoreCollection<Video>;
  private detailsCollection: AngularFirestoreCollection<ShareDetails>;

  constructor(
    private eventPageService: EventPageService,
    private cd: ChangeDetectorRef,
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.itemsCollection = this.db.collection<Video>('lists');
    this.detailsCollection = this.db.collection<ShareDetails>('details');

    this.authService.authState.subscribe(user => {
      this.uid = user.uid;
    });
  }

  ngOnInit() {
    this.addListner();
    this.requestVideoInfo();
  }

  singout() {
    this.authService.signOut();
  }

  share() {
    const postData = { ...this.video, updateDate: new Date() };

    // 分享影片資訊
    this.itemsCollection.doc(postData.id).set(postData, { merge: true });

    // 分享影片心得
    if (this.comment.trim().length > 0) {
      this.detailsCollection
        .doc(postData.id)
        .collection('comments')
        .doc(this.uid)
        .set({ comment: this.comment, updateDate: new Date() }, { merge: true })
        .then(() => {
          this.comment = '';
        });
    }

    // 分享時間記錄
    this.detailsCollection
      .doc(postData.id)
      .collection('shared')
      .doc(this.uid)
      .set({ updateDate: new Date() }, { merge: true });
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
