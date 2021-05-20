import { Component, OnInit } from '@angular/core';
import { MoralisService, DigiCollectors, DigiNft } from '../+services/moralis.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  public isLogged$: Observable<boolean> | undefined;
  public collector$: Observable<DigiCollectors> | undefined;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _moralis: MoralisService
  ) {
    const id = this._activatedRoute.snapshot.paramMap.get('id') || "";
    this.isLogged$ = this._moralis.isLogged$;
    this.collector$ = from(this._moralis.getCollector(id));
  }
}
