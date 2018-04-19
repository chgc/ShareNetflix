import { AuthGuard } from '@libs/core/auth.guard';
import { AuthService } from '@libs/core/auth.service';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [AuthGuard, AuthService]
})
export class CoreModule {}
