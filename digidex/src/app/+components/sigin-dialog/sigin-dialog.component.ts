import { Component, Inject } from '@angular/core';
import { MoralisService } from '../../+services/moralis.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sigin-dialog',
  templateUrl: './sigin-dialog.component.html',
  styleUrls: ['./sigin-dialog.component.sass']
})
export class SiginDialogComponent {

  public isLogged$: Observable<boolean> | undefined;

  constructor(
    private readonly _moralis: MoralisService) {
    this.isLogged$ = this._moralis.isLogged$;
  }
  public async signInMetamask(): Promise<void> {
    try {
      await this._moralis.loginWithMetaMask();
    } catch (error) {
      console.log(error);
    }
  }
}

