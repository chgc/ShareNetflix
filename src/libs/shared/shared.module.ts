import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePipe } from '@libs/shared/time/time.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule, TimePipe],
  declarations: [TimePipe]
})
export class SharedModule {}
