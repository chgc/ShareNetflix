import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundComponent } from './background/background.component';
import { AuthGuard } from '@libs/core/auth.guard';
import { PopupComponent } from './page-action/popup/popup.component';
import { LoginComponent } from './page-action/login/login.component';

const routes: Routes = [
  { path: 'background', component: BackgroundComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'popup',
    canActivate: [AuthGuard],
    component: PopupComponent
  },
  { path: '', pathMatch: 'full', redirectTo: '/popup' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
