import { Injectable } from '@angular/core';
import { DigiNft } from '../+services/moralis.service';

@Injectable({
  providedIn: 'root'
})
export class FightService {

  public myTeam: DigiNft[] = [];
  public availableDigiNfts: DigiNft[] = [];

  constructor() { }
}
