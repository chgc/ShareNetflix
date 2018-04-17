import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  authState = this.afAuth.authState;
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  signInWithGoole() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['/popup']));
  }

  signInWithGithub() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(() => this.router.navigate(['/popup']));
  }

  signOut() {
    this.afAuth.auth.signOut();
  }
}
