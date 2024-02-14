import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/listings',
        pathMatch: 'full'
    },
    {
        path: 'listings',
        loadChildren: () => import('./listings/listings.routes').then(r => r.LISTING_ROUTES)
    }
]