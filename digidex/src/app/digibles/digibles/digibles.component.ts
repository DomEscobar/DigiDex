import { Component, OnInit } from '@angular/core';
import { DigibleApi } from '../../+services/digible.api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-digibles',
  templateUrl: './digibles.component.html',
  styleUrls: ['./digibles.component.sass']
})
export class DigiblesComponent implements OnInit {

  public digibles$: Observable<any[]> | undefined;

  constructor(private readonly _digibleApi: DigibleApi) {
    this.digibles$ = this._digibleApi.getDigibles();
  }

  ngOnInit(): void {
  }

}
