import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { userProfileResolver } from './pages/user-profile/resolvers/user-profile.resolver';
import { RegisterComponent } from './pages/auth/register/register.component';

export const appRoutes: VexRoutes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/listings',
        pathMatch: 'full'
      },
      {
        path: 'register',
        component: RegisterComponent,
        providers: [
            AuthService
        ]
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        providers: [
            UserService
        ],
        resolve: {
            user: userProfileResolver
        }
      },
      {
        path: 'profile/:section',
        component: UserProfileComponent,
        providers: [
            UserService
        ],
        resolve: {
            user: userProfileResolver
        }
      },
      {
        path: 'listings',
        loadChildren: () => import('./pages/listings/listings.routes').then(r => r.LISTING_ROUTES)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./pages/transactions/transactions.routes').then(r => r.TRANSACTION_ROUTES)
      },
      {
        path: 'messages',
        loadChildren: () => import('./pages/messaging/messaging.routes').then(r => r.MESSAGING_ROUTES)
      }
    ]
  },
];
