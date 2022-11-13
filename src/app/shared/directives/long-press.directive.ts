import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {filter, switchMap, takeUntil, timeInterval} from 'rxjs/operators';
import { timer, fromEvent } from 'rxjs';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  private touchend$;
  private touchStart$;
  private stream$;

  @Output() onLongPress = new EventEmitter();

  constructor(ele: ElementRef) {
    this.touchStart$ = fromEvent(ele.nativeElement, 'touchstart').pipe(filter((event: any) => !event.repeat));
    this.touchend$ = fromEvent(ele.nativeElement, 'touchend').pipe(filter((event: any) => !event.repeat));
    this.stream$ = this.touchStart$.pipe(
      switchMap(() => this.touchend$),
      timeInterval(),
      filter((time: any) => time.interval > 500)
    ).subscribe(resp => {
      this.onLongPress.emit();
    });
  }


}
