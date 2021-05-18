import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [

  { path: '', redirectTo: 'digibles', pathMatch: 'full' },

  {
    path: 'welcome',
    component: WelcomeComponent
  }, {
    path: 'collectors',
    loadChildren: () => import('./collectors/collectors.module').then(m => m.CollectorsModule)
  }, {
    path: 'digibles',
    loadChildren: () => import('./digibles/digibles.module').then(m => m.DigiblesModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
