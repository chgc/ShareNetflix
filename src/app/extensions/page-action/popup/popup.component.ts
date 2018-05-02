import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Comment, ShareDetails, Shared } from '@models/shareDetails';
import { Video } from '@models/video';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '@environment';
import { AuthService } from '@libs/core/auth.service';
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
  runtime: 0
};

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {
  video;
  comment = '';
  uid;
  shareDisplay = '推薦';
  isShared: boolean;
  destroy$ = new Subject();

  private videoDetailDocument: AngularFirestoreDocument<ShareDetails>;

  constructor(
    private eventPageService: EventPageService,
    private cd: ChangeDetectorRef,
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  ngOnInit() {
    this.addListener();
    this.requestVideoInfo();

    if (!environment.production) {
      this.initFirebaseDocument(mockData);
    }
  }

  share() {
    const postData = { ...this.video, updateDate: new Date() };

    if (!this.isShared) {
      // 分享影片資訊
      this.db.doc<Video>(`videos/${this.video.id}`).set(postData, { merge: true });
      // 分享時間記錄
      this.videoDetailDocument
        .collection('shareBy')
        .doc(this.uid)
        .set({ uid: this.uid, updateDate: new Date() });
    }

    // 分享影片心得
    if (this.comment.trim().length > 0) {
      this.videoDetailDocument
        .collection('comments')
        .doc(this.uid)
        .set({ comment: this.comment, updateDate: new Date() }, { merge: true });
    }
  }

  private initFirebaseDocument(video) {
    this.videoDetailDocument = this.db.doc<ShareDetails>(`videoDetails/${video.id}`);

    combineLatest(
      this.videoDetailDocument.collection('shareBy', ref => ref.where('uid', '==', this.uid)).valueChanges(),
      this.videoDetailDocument
        .collection('comments')
        .doc(this.uid)
        .valueChanges()
    )
      .pipe(
        takeUntil(this.destroy$),
        map((ds: [Shared[], Comment]) => {
          return { shared: ds[0].length > 0, comment: (ds[1] && ds[1].comment) || '' };
        })
      )
      .subscribe(({ shared, comment }) => {
        this.video = video;
        this.comment = comment;
        this.shareDisplay = shared ? '更新' : '推薦';
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private addListener() {
    if (typeof chrome.runtime.onMessage !== 'undefined') {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'GOT_RESULT') {
          this.initFirebaseDocument(message.payload);
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
