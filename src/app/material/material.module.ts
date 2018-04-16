import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule } from '@angular/material';

@NgModule({
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatCardModule]
})
export class MaterialModule {}
