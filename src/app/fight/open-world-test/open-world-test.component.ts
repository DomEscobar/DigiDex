import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { MoralisService, WorldUser, DigiCollectors } from '../../+services/moralis.service';
import { BehaviorSubject } from 'rxjs';
import { HostListener } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
declare const Moralis: any;

@Component({
  selector: 'app-open-world-test',
  templateUrl: './open-world-test.component.html',
  styleUrls: ['./open-world-test.component.sass']
})
export class OpenWorldTestComponent implements AfterViewInit {

  public meWorldUser$ = new BehaviorSubject<WorldUser | undefined>(undefined);
  public players$ = new BehaviorSubject<WorldUser[]>([]);

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
    });
  }

  async initOtherPlayers() {
    const meId = this.meWorldUser$.getValue()?.tid;
    const users = await (await this._moralis.getList<WorldUser>(WorldUser.createEmpty(), 20)).filter(o => o.tid != meId);
    this.players$.next(users);

    let query = new Moralis.Query('WorldUser');
    let subscription = await query.subscribe();

    subscription.on('update', (object: any) => {

      if (object.get("tid") == meId) {
        return;
      }

      const list = this.players$.getValue();
      const existing = list.find(o => o.tid == object.get("tid"));
      if (existing) {
        existing.x = object.get("x");
        existing.y = object.get("y");
      } else {
        const newUser = this._moralis.mapTo<WorldUser>(WorldUser.createEmpty(), object);
        list.push(newUser);
      }

      this.players$.next(list);
    });
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

    await this.initOtherPlayers();
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
    }, 25);
  }

}
