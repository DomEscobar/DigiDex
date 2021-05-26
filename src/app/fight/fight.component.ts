import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DigiNft, MoralisService } from '../+services/moralis.service';
import { FightService } from './fight.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CardSelectDialogComponent } from './+components/card-select-dialog/card-select-dialog.component';
@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.sass']
})
export class FightComponent {

  public myTeam$ = new BehaviorSubject<any[]>([undefined, undefined, undefined]);
  public isDisabled = true;
  public areAnyAvailable?: boolean;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _fightService: FightService,
    private readonly _moralis: MoralisService) {
    this.myTeam$.subscribe((team) => {
      this._fightService.availableDigiNfts = this._fightService.availableDigiNfts.filter((nft) => {
        return team.indexOf(nft) == -1;
      });
    });
  }

  async ngOnInit() {
    const one = await this._moralis.getDigible('5');
    const two = await this._moralis.getDigible('6');
    const three = await this._moralis.getDigible('4');
    const fr = await this._moralis.getDigible('29');
    const u = await this._moralis.getDigible('22');


    if (one && two && three && fr && u) {
      this._fightService.availableDigiNfts = [one, two, three, fr, u];
      this.areAnyAvailable = true;
    }
  }

  onAttack() {
    if (this.isDisabled) {
      return;
    }

    this._fightService.myTeam = this.myTeam$.getValue();
    this._router.navigate(['fight/attack']);
  }

  onLive() {
    alert("Not available yet")
  }

  onCardOpenSelect(index: number, digible: any) {

    if (!this.areAnyAvailable) {
      alert("You have no Digibles available");
      return;
    }

    this._dialog.open(CardSelectDialogComponent, {
      disableClose: true,
      width: "800px"
    }).afterClosed().subscribe(selectedDigible => {

      // removed slot
      if (digible != selectedDigible && digible != undefined) {
        this._fightService.availableDigiNfts.push(digible);
      }

      const team = this.myTeam$.getValue();
      team[index] = selectedDigible;
      this.myTeam$.next(team);

      this.isDisabled = team.filter(o => o == undefined).length != 0;
    });
  }
}