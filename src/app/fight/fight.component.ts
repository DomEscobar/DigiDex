import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { MoralisService, WorldUser, DigiCollectors } from '../+services/moralis.service';
import { BehaviorSubject } from 'rxjs';
import { HostListener } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.sass']
})
export class FightComponent implements AfterViewInit {

  public meWorldUser$ = new BehaviorSubject<WorldUser | undefined>(undefined);
  private meworld: any;
  private canMove = true;
  public spriteDirection = "down";

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();

    if (!this.canMove) {
      return;
    }

    const user = this.meWorldUser$.getValue();

    if (user != undefined) {
      if (event.key == 'ArrowUp') {
        this.moveToPosition(user.x || "0", Number(user.y) - 16 + "");
        this.spriteDirection = "up";
      }
      if (event.key == 'ArrowDown') {
        this.moveToPosition(user.x || "0", Number(user.y) + 16 + "");
        this.spriteDirection = "down";

      }
      if (event.key == 'ArrowLeft') {
        this.moveToPosition(Number(user.x) - 16 + "", user.y || "0");
        this.spriteDirection = "left";
      }
      if (event.key == 'ArrowRight') {
        this.moveToPosition(Number(user.x) + 16 + "", user.y || "0");
        this.spriteDirection = "right";
      }
      this.canMove = false;
    }
  }

  constructor(private readonly _moralis: MoralisService) {
    this.meWorldUser$.asObservable().pipe(debounceTime(350)).subscribe(user => {
      window.scrollTo({ top: Number(user?.y), left: Number(user?.x) - (window.innerWidth / 2), behavior: 'smooth' })
    })
  }

  async ngAfterViewInit() {
    if (this._moralis.isLogged$.getValue()) {
      let worldUser = await this._moralis.getItem<WorldUser>(WorldUser.createEmpty(), "tid", this._moralis.getCurrentEthAddress())
      const myself = await this._moralis.getItem<DigiCollectors>(DigiCollectors.createEmpty(), "tid", this._moralis.getCurrentEthAddress())

      if (worldUser == undefined) {
        worldUser = new WorldUser("20", "20", myself?.name, myself?.tid);
        await this._moralis.add(worldUser);
      }

      this.meWorldUser$.next(worldUser);
      this.meworld = await this._moralis.getItem(WorldUser.createEmpty(), "tid", worldUser.tid || "", true);
    }
  }

  public async moveToPosition(x: string, y: string) {
    this.meworld.set("x", x);
    this.meworld.set("y", y);
    await this.meworld.save();
    const user = this.meWorldUser$.getValue();
    if (user) {
      user.x = x;
      user.y = y;
      this.meWorldUser$.next(user);
    }

    setTimeout(() => {
      this.canMove = true;
    }, 50);
  }

}
