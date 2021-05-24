import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FightComponent } from './fight.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './open-world-test/player/player.component';
import { OpenWorldTestComponent } from './open-world-test/open-world-test.component';
import { BattlegroundComponent } from './battleground/battleground.component';
import { GameEndDialogComponent } from './battleground/game-end-dialog/game-end-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CardSelectDialogComponent } from './+components/card-select-dialog/card-select-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: FightComponent
  },
  {
    path: 'attack',
    component: BattlegroundComponent
  }
];

@NgModule({
  declarations: [
    FightComponent,
    PlayerComponent,
    OpenWorldTestComponent,
    BattlegroundComponent,
    GameEndDialogComponent,
    CardSelectDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FightModule { }
