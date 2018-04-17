import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundComponent } from './background/background.component';
import { PopupComponent } from './popup/popup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

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
