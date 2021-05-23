import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  }, {
    path: 'collectors',
    loadChildren: () => import('./collectors/collectors.module').then(m => m.CollectorsModule)
  }, {
    path: 'digibles',
    loadChildren: () => import('./digibles/digibles.module').then(m => m.DigiblesModule)
  }, {
    path: 'fight',
    loadChildren: () => import('./fight/fight.module').then(m => m.FightModule)
  }, {
    path: 'league',
    loadChildren: () => import('./league/league.module').then(m => m.LeagueModule)
  }, {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
