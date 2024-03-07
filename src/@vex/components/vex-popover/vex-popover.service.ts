import { ComponentRef, ElementRef, Injectable, InjectionToken, Injector } from '@angular/core';
import {
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { VexPopoverContent, VexPopoverRef } from './vex-popover-ref';
import { VexPopoverComponent } from './vex-popover.component';

export interface VexPopoverParams<T> {
  width?: string | number;
  height?: string | number;
  origin: ElementRef | HTMLElement;
  position?: ConnectionPositionPair[];
  content: VexPopoverContent;
  data?: T;
  offsetY?: number;
  offsetX?: number;
}

export const DATA_TOKEN = new InjectionToken<any>('portal-data');

@Injectable({
  providedIn: 'root'
})
export class VexPopoverService {
  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}

  open<T>({
    origin,
    content,
    data,
    width,
    height,
    position,
    offsetX,
    offsetY
  }: VexPopoverParams<T>): VexPopoverRef<T> {
    const overlayRef = this.overlay.create(
      this.getOverlayConfig({
        origin,
        width,
        height,
        position,
        offsetX,
        offsetY
      })
    );
    const popoverRef = new VexPopoverRef<T>(overlayRef, content, data);

    const injector = this.createInjector(popoverRef, this.injector, data);
    const componentPortal = new ComponentPortal(VexPopoverComponent, null, injector);
    overlayRef.attach(componentPortal);

    return popoverRef
  }

  private static getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom'
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top'
      }
    ];
  }

  createInjector(popoverRef: VexPopoverRef, injector: Injector, data: any) {
    console.log('creating injector with data: ', data);
    return Injector.create({
      providers: [
        {
          provide: VexPopoverRef,
          useValue: popoverRef
        },
        {
          provide: DATA_TOKEN,
          useValue: data
        }
      ],
      parent: injector
    });
  }

  private getOverlayConfig({
    origin,
    width,
    height,
    position,
    offsetX,
    offsetY
  }: {
    origin: FlexibleConnectedPositionStrategyOrigin;
    width?: string | number;
    height?: string | number;
    position?: ConnectedPosition[];
    offsetX?: number;
    offsetY?: number;
  }): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: 'vex-popover-backdrop',
      positionStrategy: this.getOverlayPosition({
        origin,
        position,
        offsetX,
        offsetY
      }),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private getOverlayPosition({
    origin,
    position,
    offsetX,
    offsetY
  }: {
    origin: FlexibleConnectedPositionStrategyOrigin;
    position?: ConnectedPosition[];
    offsetX?: number;
    offsetY?: number;
  }): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(position || VexPopoverService.getPositions())
      .withFlexibleDimensions(true)
      .withDefaultOffsetY(offsetY || 0)
      .withDefaultOffsetX(offsetX || 0)
      .withTransformOriginOn('.vex-popover')
      .withPush(true);
  }
}
