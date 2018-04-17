import { AuthGuard } from '@app/core/auth.guard';
import { AuthService } from '@app/core/auth.service';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [AuthGuard, AuthService]
})
export class CoreModule {}
