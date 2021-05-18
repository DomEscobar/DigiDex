import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DigibleApi } from '../../+services/digible.api';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.sass']
})
export class CollectorsComponent {

  public collectors$: Observable<any[]> | undefined;

  constructor(private readonly _digibleApi: DigibleApi) {
    this.collectors$ = this._digibleApi.getCollectors();
  }

}
