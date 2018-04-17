import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventPageService } from './event-page.service';
import { LoginComponent } from './login/login.component';
import { PopupComponent } from './popup/popup.component';
import { TimePipe } from './time.pipe';
import { MaterialModule } from '@app/material/material.module';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule],
  declarations: [PopupComponent, TimePipe, LoginComponent],
  providers: [EventPageService],
  exports: [PopupComponent, TimePipe, LoginComponent]
})
export class PageActionModule {}
