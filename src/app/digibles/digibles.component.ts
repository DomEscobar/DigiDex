import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DigiNft, MoralisService } from '../+services/moralis.service';

@Component({
  selector: 'app-digibles',
  templateUrl: './digibles.component.html',
  styleUrls: ['./digibles.component.sass']
})
export class DigiblesComponent implements OnInit {

  public digibles$: Observable<DigiNft[]> | undefined;

  constructor(private readonly _moralis: MoralisService) {
    this.digibles$ = from(this._moralis.getDigibles());
  }

  ngOnInit(): void {
  }

}
