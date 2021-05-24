import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FightService } from '../../fight.service';
import { DigiNft } from '../../../+services/moralis.service';

@Component({
  selector: 'app-card-select-dialog',
  templateUrl: './card-select-dialog.component.html',
  styleUrls: ['./card-select-dialog.component.sass']
})
export class CardSelectDialogComponent {

  public availableDigiNfts: DigiNft[] = [];
  public selectedDigiNft?: DigiNft;

  constructor(
    private readonly _dialogRef: MatDialogRef<CardSelectDialogComponent>,
    private readonly _fightService: FightService
  ) {
    this.availableDigiNfts = this._fightService.availableDigiNfts;
  }

  public close() {
    this._dialogRef.close(this.selectedDigiNft);
  }

  public onSelectCard(card: DigiNft) {
    this.selectedDigiNft = card;
    this.close();
  }
}
