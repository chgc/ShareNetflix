import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { EventPageService } from './event-page.service';
import { MaterialModule } from './material.module';
import { PopupComponent } from './popup/popup.component';
import { TimePipe } from './time.pipe';

@NgModule({
  declarations: [AppComponent, BackgroundComponent, PopupComponent, TimePipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [EventPageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
