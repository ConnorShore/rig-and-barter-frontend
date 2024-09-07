import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IUserResponse } from 'src/app/models/user-info/user-response';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {

  private user: any;

  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    // this.user = this.authService.getCurrentKeycloakUser();
    // this.authService.userProfile$.subscribe((user: IUserResponse | undefined) => {
    //   this.user = user;
    //   this.loadNavigation();
    // });
    this.loadNavigation();
  }

  loadNavigation(): void {
    console.log('user on loader: ', this.user);
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
