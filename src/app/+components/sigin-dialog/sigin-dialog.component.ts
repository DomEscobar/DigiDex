import { Component } from '@angular/core';
import { MoralisService, DigiCollectors } from '../../+services/moralis.service';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-sigin-dialog',
  templateUrl: './sigin-dialog.component.html',
  styleUrls: ['./sigin-dialog.component.sass']
})
export class SiginDialogComponent {

  public isLogged$: Observable<boolean> | undefined;
  public emailSign?: EmailSign;

  constructor(
    private readonly _dialogRef: MatDialogRef<SiginDialogComponent>,
    private readonly _moralis: MoralisService) {
    this.isLogged$ = this._moralis.isLogged$;
  }
  public async signInMetamask(): Promise<void> {
    try {
      await this._moralis.loginWithMetaMask();
      let user = await this._moralis.getItem(DigiCollectors.createEmpty(), "tid", this._moralis.getCurrentEthAddress())

      if (user == undefined) {
        user = new DigiCollectors(
          this._moralis.getCurrentEthAddress(),
          await this._moralis.randomName(),
          undefined
        );

        await this._moralis.add(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public close() {
    this._dialogRef.close();
  }

  public onActivateEmail() {
    this.emailSign = new EmailSign();
  }
}

class EmailSign {
  email?: string;
  password?: string;
}