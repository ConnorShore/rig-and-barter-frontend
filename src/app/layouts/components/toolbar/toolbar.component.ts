import {
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  inject,
  OnInit,
  Output
} from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { Observable, of } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { ToolbarUserComponent } from './toolbar-user/toolbar-user.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { NavigationItemComponent } from '../navigation/navigation-item/navigation-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationItem } from '../../../core/navigation/navigation-item.interface';
import { checkRouterChildsData } from '@vex/utils/check-router-childs-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateListingComponent } from 'src/app/pages/listings/create-listing/create-listing.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from 'src/app/services/notification.service';
import { IFrontEndNotification } from 'src/app/model/notification/front-end-notification';

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    RouterLink,
    MatMenuModule,
    NgClass,
    NgFor,
    NavigationItemComponent,
    ToolbarNotificationsComponent,
    ToolbarUserComponent,
    NavigationComponent,
    MatDialogModule,
    AsyncPipe,
    MatTooltipModule
  ],
  providers: [
    KeycloakService
  ]
})
export class ToolbarComponent implements OnInit {
  @HostBinding('class.shadow-b')
  showShadow: boolean = false;

  @Output() listingCreated = new EventEmitter<void>();

  navigationItems$: Observable<NavigationItem[]> =
    this.navigationService.items$;

  isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'horizontal')
  );
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'in-toolbar')
  );
  isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'below-toolbar')
  );
  userVisible$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );
  title$: Observable<string> = this.configService.select(
    (config) => config.sidenav.title
  );

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  megaMenuOpen$: Observable<boolean> = of(false);

  isUserLoggedIn = this.authService.isLoggedIn();
  loggedInUser = this.authService.getUserProfile();
  userNotifications: IFrontEndNotification[] = [];

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly configService: VexConfigService,
    private readonly navigationService: NavigationService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.showShadow = checkRouterChildsData(
          this.router.routerState.root.snapshot,
          (data) => data.toolbarShadowEnabled ?? false
        );
      });

      if(this.authService.isLoggedIn()) {
        this.notificationService.getAllNotificationsForUser().subscribe((notifications: IFrontEndNotification[]) => {
          console.log('got all user notifications: ', notifications);
          this.userNotifications = notifications;
  
          // TODO: Populate the notification dropdown with the notifications (have default for no notifications or "user needs to login in order to see notifications")
        });
      }
  }

  openQuickpanel(): void {
    this.layoutService.openQuickpanel();
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  openSearch(): void {
    this.layoutService.openSearch();
  }

  loginUser() {
    this.authService.login();
  }

  registerUser() {
    console.log('registered clicked');
    this.authService.register();
  }

  createListingClicked() {
    this.dialog.open(CreateListingComponent, {
      width: '600px',
      minHeight: '500px',
      maxHeight: '800px'
    })
    .afterClosed()
    .subscribe(createdListing => {
      // if(createdListing) {
        this.listingCreated.emit();
      // }
    });
  }
}
