import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {

  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'link',
        label: 'Explore Listings',
        route: '/listings',
        icon: 'mat:devices',
        canDisable: false

        // type: 'subheading',
        // label: 'Listings',
        // children: [
        //   {
        //     type: 'link',
        //     label: 'Analytics',
        //     route: '/listings',
        //     icon: 'mat:insights',
        //     routerLinkActiveOptions: { exact: true }
        //   }
        // ]
      },
      {
        type: 'link',
        label: 'View Transactions',
        route: '/transactions',
        icon: 'logo:reciept',
        canDisable: true
      },
      {
        type: 'link',
        label: 'My PC Builds',
        route: '/pc-builder',
        icon: 'mat:computer',
        canDisable: true
      }
    ]);
  }
}
