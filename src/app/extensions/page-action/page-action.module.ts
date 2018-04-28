import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventPageService } from './event-page.service';
import { LoginComponent } from './login/login.component';
import { PopupComponent } from './popup/popup.component';
import { MaterialModule } from '@app/material/material.module';
import { SharedModule } from '@libs/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule, SharedModule],
  declarations: [PopupComponent, LoginComponent],
  providers: [EventPageService],
  exports: [PopupComponent, LoginComponent]
})
export class PageActionModule {}
