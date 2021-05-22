import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FightComponent } from './fight.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './open-world-test/player/player.component';
import { OpenWorldTestComponent } from './open-world-test/open-world-test.component';

const routes: Routes = [
  {
    path: '',
    component: FightComponent
  }
];

@NgModule({
  declarations: [
    FightComponent,
    PlayerComponent,
    OpenWorldTestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FightModule { }
