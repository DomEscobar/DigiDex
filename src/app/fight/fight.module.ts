import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FightComponent } from './fight.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
  {
    path: '',
    component: FightComponent
  }
];

@NgModule({
  declarations: [
    FightComponent,
    PlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FightModule { }
