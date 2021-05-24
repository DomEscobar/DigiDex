import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-end-dialog',
  templateUrl: './game-end-dialog.component.html',
  styleUrls: ['./game-end-dialog.component.sass']
})
export class GameEndDialogComponent implements OnInit {
  public isWon?: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isWon: boolean },
    private readonly _dialogRef: MatDialogRef<GameEndDialogComponent>,
    private readonly _router: Router) {
    this.isWon = this.data.isWon;
  }

  ngOnInit(): void {
  }

  ok() {
    this._dialogRef.close();
    this._router.navigate(["/fight"]);
  }

}
