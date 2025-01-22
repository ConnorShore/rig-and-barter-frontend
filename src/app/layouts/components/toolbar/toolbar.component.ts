import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { filter, map, startWith } from 'rxjs/operators';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateListingComponent } from 'src/app/pages/listings/create-listing/create-listing.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from 'src/app/services/notification.service';
import { IFrontEndNotification } from 'src/app/models/notification/front-end-notification';
import { IListing } from 'src/app/models/listing';
import { NotificationHandlerService } from 'src/app/services/notification-handler.service';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { NewAuthService } from 'src/app/services/new-auth.service';

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
    NotificationHandlerService
  ]
})
export class ToolbarComponent implements OnInit {
  @HostBinding('class.shadow-b')
  showShadow: boolean = false;

  @Output() listingCreated = new EventEmitter<IListing>();

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

  userProfile: IUserResponse | undefined;

  userNotifications: IFrontEndNotification[] = [];

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly configService: VexConfigService,
    private readonly navigationService: NavigationService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly newAuthService : NewAuthService
  ) {}

  ngOnInit() {
    this.newAuthService.userProfile.subscribe(user => {
        this.userProfile = user;
    });

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

      if(this.newAuthService.isAuthenticated()) {
        this.notificationService.getAllNotificationsForUser().subscribe((notifications: IFrontEndNotification[]) => {
          this.userNotifications = notifications.reverse();
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
    // this.authService.login();
    this.newAuthService.login();
  }

  registerUser() {
    this.router.navigate(['/register']);
  }

  createListingClicked() {
    this.dialog.open(CreateListingComponent, {
      width: '600px',
      minHeight: '500px',
      maxHeight: '800px'
    })
    .afterClosed()
    .subscribe(createdListing => {
      this.listingCreated.emit(createdListing);
    });
  }
}
