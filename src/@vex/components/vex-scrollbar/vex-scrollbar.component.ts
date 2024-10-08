import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';
import SimpleBar from 'simplebar';

@Component({
  selector: 'vex-scrollbar',
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./vex-scrollbar.component.scss'],
  host: {
    class: 'vex-scrollbar'
  },
  standalone: true
})
export class VexScrollbarComponent implements AfterContentInit, OnDestroy {
  @Input() options?: Partial<any>;

  scrollbarRef?: SimpleBar;

  constructor(
    private _element: ElementRef,
    private zone: NgZone
  ) {}

  ngAfterContentInit() {
    this.zone.runOutsideAngular(() => {
      this.scrollbarRef = new SimpleBar(
        this._element.nativeElement,
        this.options
      );
    });
  }

  scrollToBottom() {
    console.log('scrolling to bottom');
    console.log('scroll elem: ', this.scrollbarRef?.getScrollElement());
    this.scrollbarRef?.getScrollElement()?.scrollTo(0, 999999);
  }

  ngOnDestroy(): void {
    /**
     * Exists, but not typed in the type definition
     * https://github.com/Grsmto/simplebar/blob/master/packages/simplebar/src/simplebar.js#L903
     */
    if (this.scrollbarRef && (this.scrollbarRef as any).unMount) {
      (this.scrollbarRef as any).unMount();
    }
  }
}
