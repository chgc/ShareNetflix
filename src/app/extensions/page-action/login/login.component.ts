import { Component, OnInit } from '@angular/core';
import { AuthService } from '@libs/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.signInAnonymously();
  }
}
