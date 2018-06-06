import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { CoreModule } from '@libs/core/core.module';
import { SharedModule } from '@libs/shared/shared.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { VideoStoreService } from '@sites/video-store.service';

@NgModule({
  declarations: [AppComponent, VideoCardComponent, HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    LazyLoadImageModule,
    SharedModule
  ],
  providers: [VideoStoreService],
  bootstrap: [AppComponent]
})
export class AppModule {}
