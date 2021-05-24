import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FightService } from '../fight.service';
import { MoralisService, DigiNft, BattleStats, BattleAttack, DigiCollectors } from '../../+services/moralis.service';
import { MatDialog } from '@angular/material/dialog';
import { GameEndDialogComponent } from './game-end-dialog/game-end-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { bufferTime, debounceTime, delay, throttleTime } from 'rxjs/operators';

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
  public isRunningAction?: boolean;

  private _battleLog$ = new BehaviorSubject("");
  public battleLog$?: Observable<string> | undefined;

  public playerCardAni = "playerAni";
  public enemyCardAni = "enemyAni";

  public enemyText?: string;
  public playerText?: string;

  constructor(
    private readonly _router: Router,
    private readonly dialog: MatDialog,
    private readonly _fightService: FightService,
    private readonly _moralis: MoralisService) {
    this.playerTeam = this.clone(this._fightService.myTeam);
    this.enemyTeam = this.clone(this._fightService.myTeam);

    this.battleLog$ = this._battleLog$.asObservable();
  }

  async ngOnInit() {
    await this.setPlayerCard(0);
    await this.setEnemyCard(0);
    this.enemy = await this._moralis.getCollector('0xC4F4f936c4364Da7ECA5eEaCc6CD9F1C735a0839');
    this.player = await this._moralis.getCollector('0x000000000000000000000000000000000000dEaD');//TODOme

    this._battleLog$.next(this.player.name + " vs " + this.enemy.name);
  }

  private clone(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  }

  private async setPlayerCard(index: number) {
    this.playerCard = this.playerTeam[index];
    this.animatePlayer("pulse", 200);
    await this.fetchCardStats(this.playerCard);
    this._battleLog$.next("GO " + this.playerCard.name);
  }

  private async setEnemyCard(index: number) {
    this.enemyCard = this.enemyTeam[index];
    this.animateEnemy("pulse", 200);
    await this.fetchCardStats(this.enemyCard);
    this._battleLog$.next("Enemy sets " + this.enemyCard.name);
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
      await sleep(500);
      this._battleLog$.next(this.enemyCard.name + " defeted");
      await sleep(500);

      let index = this.enemyTeam.findIndex(o => o.tid == this.enemyCard?.tid);

      this.isGameFinished = index == this.enemyTeam.length - 1;

      if (!this.isGameFinished) {
        await this.setEnemyCard(index + 1)
      }
    }

    if (Number(this.playerCard?.hp) <= 0 && this.playerCard) {
      this.playerCard.isDead = true;
      await sleep(500);
      this._battleLog$.next(this.playerCard.name + " defeted");
      await sleep(500);

      this.isGameFinished = this.playerTeam.filter(o => !o.isDead).length == 0;

      if (!this.isGameFinished) {
        const nextCard = this.playerTeam.find(o => !o.isDead);
        await this.setPlayerCard(this.playerTeam.findIndex(o => nextCard ? o.tid == nextCard.tid : undefined))
      }
    }

    if (this.isGameFinished) {
      this.dialog.open(GameEndDialogComponent, {
        data: { isWon: this.enemyTeam.filter(o => !o.isDead).length == 0 },
        disableClose: true,
        width: "350px"
      }).afterClosed().subscribe(() => this._router.navigate(["/fight"]));
    }
  }

  public async onAttack(attack: BattleAttack, playerTurn?: boolean, event?: Event) {


    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    if (this.isPlayerturn == !playerTurn || this.isRunningAction) {
      return;
    }
    this.isRunningAction = true;

    this._battleLog$.next((playerTurn ? "YOU : " : "Enemy : ") + attack.name);

    if (this.isPlayerturn) {
      await this.animatePlayer("playerAttack", 500);
    } else {
      await this.animateEnemy("enemyAttack", 500);
    }

    const success = await this._moralis.attack(Number(attack.strength));

    if (!success) {
      this._battleLog$.next(attack.name + " missed!");
      this.isPlayerturn ? this.textEnemy("Attack missed") : this.textPlayer("Attack missed");
    } else {
      if (!this.isPlayerturn) {
        await this.animatePlayer("shake", 200);
      } else {
        await this.animateEnemy("shake", 200);
      }

      this.isPlayerturn ? this.textEnemy("-" + attack.strength) : this.textPlayer("-" + attack.strength);
    }

    if (success && this.enemyCard != undefined && this.playerCard != undefined) {

      if (this.isPlayerturn) {
        this.enemyCard.hp = "" + (Number(this.enemyCard?.hp) - Number(attack.strength))
      } else {
        this.playerCard.hp = "" + (Number(this.playerCard?.hp) - Number(attack.strength))
      }

      await this.checkDeath();
    }

    this.isPlayerturn = !this.isPlayerturn;
    this.isRunningAction = false;

    if (!this.isPlayerturn) {
      await sleep(500);
      this.enemyChooseAttack();
    }
  }

  public async onSwitch(card: BattleCard) {
    if (card.isDead) {
      return;
    }

    await this.setPlayerCard(this.playerTeam.findIndex(o => o.tid == card.tid));
    this.isPlayerturn = !this.isPlayerturn;
    this.enemyChooseAttack();
  }

  private enemyChooseAttack() {
    if (this.enemyCard && this.enemyCard.attacks) {
      const attacks = this.enemyCard.attacks;
      this.onAttack(attacks[Math.floor(Math.random() * attacks.length)])
    }
  }

  private async animatePlayer(aniClass: string, ms: number) {
    this.playerCardAni = aniClass;
    await sleep(ms);
    this.playerCardAni = "playerAni";
  }

  private async animateEnemy(aniClass: string, ms: number) {
    this.enemyCardAni = aniClass;
    await sleep(ms);
    this.enemyCardAni = "enemyAni";
  }

  private async textPlayer(text: string, ms: number = 500) {
    this.playerText = text;
    await sleep(ms);
    this.playerText = undefined;
  }

  private async textEnemy(text: string, ms: number = 500) {
    this.enemyText = text;
    await sleep(ms);
    this.enemyText = undefined;
  }
}

export class BattleCard extends DigiNft {
  public hp?: string;
  public attacks?: BattleAttack[];
  public isDead?: boolean;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}