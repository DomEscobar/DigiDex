import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MoralisService, DigiCollectors } from '../../+services/moralis.service';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.sass']
})
export class CollectorsComponent {

  public collectors$: Observable<DigiCollectors[]> | undefined;

  constructor(private readonly _moralis: MoralisService) {
    this.collectors$ = from(this._moralis.getCollectors());
  }

}
