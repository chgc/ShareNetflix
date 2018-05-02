import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  authState = this.afAuth.authState;
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously().then(this.redirectToPopup());
  }

  signInWithSocial(loginProvider) {
    let provider;
    switch (loginProvider) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'github':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
    }
    if (!provider) {
      return;
    }
    if (firebase.auth().currentUser !== null && firebase.auth().currentUser.isAnonymous === true) {
      firebase
        .auth()
        .currentUser.linkWithPopup(provider)
        .then(this.redirectToPopup());
    } else {
      this.afAuth.auth.signInWithPopup(provider).then(this.redirectToPopup());
    }
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/login']));
  }
  private redirectToPopup() {
    return () => this.router.navigate(['/popup']);
  }
}
