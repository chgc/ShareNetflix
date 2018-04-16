import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { EventPageService } from './event-page.service';
import { PopupComponent } from './popup/popup.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [AppComponent, BackgroundComponent, PopupComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule
  ],
  providers: [EventPageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
