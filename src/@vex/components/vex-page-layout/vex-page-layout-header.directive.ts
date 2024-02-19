import { Directive } from '@angular/core';

@Directive({
  selector: '[vexPageLayoutHeader],vex-page-layout-header',
  host: {
    class: 'vex-page-layout-header'
  },
  standalone: true
})
export class VexPageLayoutHeaderDirective {
  constructor() {}
}
