import { Component, OnInit } from '@angular/core';
import { SiginDialogComponent } from '../+components/sigin-dialog/sigin-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MoralisService } from '../+services/moralis.service';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getBrowserAddress } from '../+services/utils';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  public isLogged$: Observable<boolean> | undefined;
  public myEthAddress: string | undefined;
  constructor(
    private readonly _router: Router,
    private readonly dialog: MatDialog,
    private readonly _moralis: MoralisService) {
    this.isLogged$ = this._moralis.isLogged$.asObservable().pipe(delay(1000), tap((isLogged) => {
      if (isLogged) {
        this.myEthAddress = this._moralis.getCurrentEthAddress() || getBrowserAddress();
      }
    }));
  }

  public signIn() {

    if (this.myEthAddress != undefined) {
      this._router.navigate(['profile', this.myEthAddress]);
      return;
    }

    this.dialog.open(SiginDialogComponent, {
    });
  }

}
