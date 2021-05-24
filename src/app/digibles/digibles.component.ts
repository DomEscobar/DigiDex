import { Component, OnInit, AfterViewInit, HostListener, DoCheck, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { DigiNft } from '../+services/moralis.service';
import { DigibleService } from './digible.service';

@Component({
  selector: 'app-digibles',
  templateUrl: './digibles.component.html',
  styleUrls: ['./digibles.component.sass']
})
export class DigiblesComponent implements AfterViewChecked {
  scrolled: boolean = false;

  public digibles$: Observable<DigiNft[]> | undefined;
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {

    if (!this.scrolled && this._digibleService.scrollPosition != 0) {
      return;
    }

    this._digibleService.scrollPosition = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
  }

  constructor(
    private readonly _digibleService: DigibleService) {
    this.digibles$ = this._digibleService.digibles$;
  }

  ngAfterViewChecked(): void {
    if (this.scrolled)
      return;

    setTimeout(() => {

      this.scrolled = true;
      window.scrollTo({
        top: this._digibleService.scrollPosition
      })
    }, 500);
  }

}
