import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackgroundComponent } from './background/background.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  { path: 'background', component: BackgroundComponent },
  {
    path: 'popup',
    component: PopupComponent
  },
  { path: '', pathMatch: 'full', redirectTo: '/popup' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
