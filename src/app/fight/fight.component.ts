import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DigiNft, MoralisService } from '../+services/moralis.service';
import { FightService } from './fight.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.sass']
})
export class FightComponent {

  public myTeam$ = new BehaviorSubject<DigiNft[]>([]);
  public availableDigiNfts$ = new BehaviorSubject<DigiNft[]>([]);

  constructor(
    private readonly _router: Router,
    private readonly _fightService: FightService,
    private readonly _moralis: MoralisService) {
  }

  async ngOnInit() {
    // MOCK TEAM
    const one = await this._moralis.getItem<DigiNft>(DigiNft.createEmpty(), "tid", "5");
    const two = await this._moralis.getItem<DigiNft>(DigiNft.createEmpty(), "tid", "6");
    const three = await this._moralis.getItem<DigiNft>(DigiNft.createEmpty(), "tid", "4");

    if (one && two && three) {
      this.myTeam$.next([one, two, three]);
    }
  }

  onAttack() {
    this._fightService.myTeam = this.myTeam$.getValue();
    this._router.navigate(["fight/attack"]);
  }
}