import { Directive, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
declare const Zooming: any;

@Directive({
  selector: '[appZoomAble]'
})
export class ZoomAbleDirective implements AfterViewInit {

  @Output()
  public zoom = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }


  ngAfterViewInit() {
    (this.elementRef.nativeElement as HTMLElement).classList.add("img-zoomable");
    setTimeout(() => {
      new Zooming({
        zIndex: 2000,
        onBeforeOpen: (target: any) => {
          this.zoom.emit(true)
        },
        onClose: (target: any) => {
          this.zoom.emit(false)
        }
      }).listen('.img-zoomable')
    }, 1000)
  }

}
