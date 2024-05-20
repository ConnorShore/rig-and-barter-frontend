import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

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
        path: 'listings',
        loadChildren: () => import('./pages/listings/listings.routes').then(r => r.LISTING_ROUTES)
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(r => r.AUTH_ROUTES)
      },
    ]
  },
];
