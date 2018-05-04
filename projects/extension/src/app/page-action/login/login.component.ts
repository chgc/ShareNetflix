import { Component, OnInit } from '@angular/core';
import { AuthService } from '@libs/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  socialLogin(loginProvider) {
    this.authService.signInWithSocial(loginProvider);
  }
}
