import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private matIconRegistry: MatIconRegistry, private authService: AuthService) {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  signIn(way) {
    switch (way) {
      case 'google':
        this.authService.signInWithGoole();
        break;
      case 'github':
        this.authService.signInWithGithub();
        break;
    }
  }
}
