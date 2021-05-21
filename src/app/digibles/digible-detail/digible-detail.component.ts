import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoralisService, DigiNft, DigiCollectors } from '../../+services/moralis.service';
import { Observable, from, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
declare const Zooming: any;

@Component({
  selector: 'app-digible-detail',
  templateUrl: './digible-detail.component.html',
  styleUrls: ['./digible-detail.component.sass']
})
export class DigibleDetailComponent {

  public digible$: Observable<DigiNft> | undefined;
  public collector$: Observable<DigiCollectors> | undefined;
  public hasNoZoom$ = new BehaviorSubject(true);

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _moralis: MoralisService
  ) {
    const id = this._activatedRoute.snapshot.paramMap.get('id') || "";
    this.digible$ = from(this._moralis.getDigible(id)).pipe(tap(data => {
      if (data.owner) {
        this.collector$ = from(this._moralis.getCollector(data.owner));
      }
    }));

    scrollTo({
      top: 0
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      new Zooming({
        zIndex: 2000,
        onBeforeOpen: (target: any) => {
          this.hasNoZoom$.next(false)
        },
        onClose: (target: any) => {
          this.hasNoZoom$.next(true)
        }
      }).listen('.img-zoomable')
    }, 1000)
  }

}
