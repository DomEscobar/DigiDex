import { Injectable } from '@angular/core';
import { DigiNft, MoralisService } from '../+services/moralis.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DigibleService {
  public digibles$: Observable<DigiNft[]> | undefined;
  public scrollPosition: number = 0;
  constructor(
    private readonly _moralis: MoralisService) {
    this.digibles$ = from(this._moralis.getDigibles());
  }
}
