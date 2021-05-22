import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-end-dialog',
  templateUrl: './game-end-dialog.component.html',
  styleUrls: ['./game-end-dialog.component.sass']
})
export class GameEndDialogComponent implements OnInit {

  constructor(
    private readonly _router: Router) { }

  ngOnInit(): void {
  }

  ok() {
    this._router.navigate(["/fight"]);
  }

}
