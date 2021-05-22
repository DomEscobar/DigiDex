import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FightService } from '../fight.service';
import { MoralisService, DigiNft, BattleStats, BattleAttack, DigiCollectors } from '../../+services/moralis.service';
import { MatDialog } from '@angular/material/dialog';
import { GameEndDialogComponent } from './game-end-dialog/game-end-dialog.component';

@Component({
  selector: 'app-battleground',
  templateUrl: './battleground.component.html',
  styleUrls: ['./battleground.component.sass']
})
export class BattlegroundComponent implements OnInit {

  public enemy?: DigiCollectors;
  public player?: DigiCollectors;

  public playerTeam: BattleCard[] = [];
  public enemyTeam: BattleCard[] = [];

  public playerCard?: BattleCard;
  public enemyCard?: BattleCard;

  public isPlayerturn = true;

  public isGameFinished?: boolean;

  constructor(
    private readonly _router: Router,
    private readonly dialog: MatDialog,
    private readonly _fightService: FightService,
    private readonly _moralis: MoralisService) {
    this.playerTeam = this.clone(this._fightService.myTeam);
    this.enemyTeam = this.clone(this._fightService.myTeam);
  }

  async ngOnInit() {
    await this.setPlayerCard(0);
    await this.setEnemyCard(0);
    this.enemy = await this._moralis.getCollector("0xC4F4f936c4364Da7ECA5eEaCc6CD9F1C735a0839");
    this.player = await this._moralis.getCollector("0x000000000000000000000000000000000000dEaD");//TODOme
  }

  private clone(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  }

  private async setPlayerCard(index: number) {
    this.playerCard = this.playerTeam[index];
    await this.fetchCardStats(this.playerCard);
  }

  private async setEnemyCard(index: number) {
    this.enemyCard = this.enemyTeam[index];
    await this.fetchCardStats(this.enemyCard);
  }

  private async fetchCardStats(card: BattleCard) {
    if (card.tid) {
      const cardStats = await this._moralis.getItem<BattleStats>(BattleStats.createEmpty(), "tid", card.tid);
      const attacks = await this._moralis.getList<BattleAttack>(BattleAttack.createEmpty(), 100, "tid", card.tid);

      if (cardStats && attacks) {
        card.hp = cardStats.hp;
        card.attacks = attacks;
      }
    }
  }

  private async checkDeath() {
    if (Number(this.enemyCard?.hp) <= 0 && this.enemyCard) {
      this.enemyCard.isDead = true;
      let index = this.enemyTeam.findIndex(o => o.tid == this.enemyCard?.tid);

      this.isGameFinished = index == this.enemyTeam.length - 1;

      if (!this.isGameFinished) {
        this.setEnemyCard(index + 1)
      }
    }

    if (Number(this.playerCard?.hp) <= 0 && this.playerCard) {
      this.playerCard.isDead = true;
      let index = this.playerTeam.findIndex(o => o.tid == this.playerCard?.tid);

      this.isGameFinished = index == this.playerTeam.length - 1;

      if (!this.isGameFinished) {
        this.setPlayerCard(index + 1)
      }
    }

    if (this.isGameFinished) {
      this.dialog.open(GameEndDialogComponent, {
      }).afterClosed().subscribe(() => this._router.navigate(["/fight"]));
    }
  }

  public async onAttack(attack: BattleAttack, playerTurn?: boolean) {

    if (this.isPlayerturn == !playerTurn) {
      return;
    }

    const success = await this._moralis.attack(Number(attack.strength));

    if (success && this.enemyCard != undefined && this.playerCard != undefined) {

      if (this.isPlayerturn) {
        this.enemyCard.hp = "" + (Number(this.enemyCard?.hp) - Number(attack.strength))
      } else {
        this.playerCard.hp = "" + (Number(this.playerCard?.hp) - Number(attack.strength))
      }

      this.checkDeath();
    }

    this.isPlayerturn = !this.isPlayerturn;

    if (!this.isPlayerturn) {
      setTimeout(() => {
        this.enemyChooseAttack();
      }, 2000)
    }
  }

  private enemyChooseAttack() {
    if (this.enemyCard && this.enemyCard.attacks) {
      const attacks = this.enemyCard.attacks;
      this.onAttack(attacks[Math.floor(Math.random() * attacks.length)])
    }
  }


}

export class BattleCard extends DigiNft {
  public hp?: string;
  public attacks?: BattleAttack[];
  public isDead?: boolean;
}
