import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { BackgroundComponent } from './background/background.component';
import { EventPageService } from './event-page.service';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { PopupComponent } from './popup/popup.component';
import { TimePipe } from './time.pipe';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [AppComponent, BackgroundComponent, PopupComponent, TimePipe, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [EventPageService, AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
