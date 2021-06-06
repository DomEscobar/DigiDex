import { Component } from '@angular/core';
import { MoralisService, DigiCollectors } from '../+services/moralis.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { getBrowserAddress } from '../+services/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  public isLogged$: Observable<boolean> | undefined;
  public collector$: Observable<DigiCollectors> | undefined;
  public canEdit: boolean | undefined;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _moralis: MoralisService
  ) {
    const id = this._activatedRoute.snapshot.paramMap.get('id') || "";
    this.isLogged$ = this._moralis.isLogged$;
    this.collector$ = from(this._moralis.getCollector(id));

    this.canEdit = id == this._moralis.getCurrentEthAddress() || id == getBrowserAddress();

    scrollTo({
      top: 0
    })
  }

  public async onUpdateProfilePicture(event: any, collector: DigiCollectors) {
    if (event.target.files && event.target.files[0]) {
      const data = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = async () => {

        const url = await this._moralis.saveImageIFPS(data.name, reader.result?.toString() || "");

        collector.img = url;
        this._moralis.update(DigiCollectors.createEmpty(), collector, "tid", collector?.tid || "");
      };

    }
  }
}
