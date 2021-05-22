import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.sass']
})
export class PlayerComponent implements AfterViewInit {

  @ViewChild("player")
  canvas: ElementRef | undefined;

  animRowStart = 11;
  animRowFrames = 9;
  currentFrame = 0;

  constructor() { }

  async ngAfterViewInit() {
    this.drawImage();
  }

  async getImage() {
    return new Promise((resolve) => {
      var img = new Image();
      img.src = "/assets/player.png";
      img.onload = () => { resolve(img) };
    })
  }

  async drawImage() {
    const animCtx = this.canvas?.nativeElement.getContext("2d");
    if (animCtx && this.canvas) {
      imgdo(animCtx);
    }
  }
}


function imgdo(ctx: any) {
  var img = new Image();
  img.src = "/assets/player.png";

  img.onload = function () {
    // ten images in the image (see the url above)
    var totalNumberOfFrames = 9
    // This is changed to make the sprite animate  
    var imageFrameNumber = 0
    var row = 10

    setInterval(function () {
      ctx.clearRect(0, 0, 120, 120)

      // changes the sprite we look at
      imageFrameNumber++;
      // Change this from 0 to 1 to 2 ... upto 9 and back to 0 again, then 1...
      imageFrameNumber = imageFrameNumber % totalNumberOfFrames;


      ctx.drawImage(img,
        // x and y - where in the sprite
        imageFrameNumber * 64, (row) * 64,
        // width and height
        64, 64,
        // x and y - where on the screen
        0, 0,
        // width and height
        64, 64
      );

    }, 100)

  }
}