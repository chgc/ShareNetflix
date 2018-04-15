import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EventPageService } from './event-page.service';
import { BackgroundComponent } from './background/background.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [AppComponent, BackgroundComponent, PopupComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [EventPageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
