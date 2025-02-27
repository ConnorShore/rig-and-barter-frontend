import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  withFetch,
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors
} from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { provideIcons } from './core/icons/icons.provider';
import { provideLuxon } from './core/luxon/luxon.provider';
import { provideVex } from '@vex/vex.provider';
import { provideNavigation } from './core/navigation/navigation.provider';
import { vexConfigs } from '@vex/config/vex-configs';
import { provideQuillConfig } from 'ngx-quill';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ErrorInterceptor } from './shared/error.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from '../environments/environment';
import e from 'express';
import { authInterceptor } from './shared/auth.interceptor';
import { provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from 'src/config/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    KeycloakService,
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAuth(authConfig),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    importProvidersFrom(
      BrowserModule,
      MatDialogModule,
      MatBottomSheetModule,
      MatNativeDateModule
    ),
    provideRouter(
      appRoutes,
      // TODO: Add preloading withPreloading(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideVex({
      /**
       * The config that will be used by default.
       * This can be changed at runtime via the config panel or using the VexConfigService.
       */
      config: vexConfigs.poseidon,
      /**
       * Only themes that are available in the config in tailwind.config.ts should be listed here.
       * Any theme not listed here will not be available in the config panel.
       */
      availableThemes: [
        {
          name: 'Default',
          className: 'vex-theme-default'
        },
        {
          name: 'Teal',
          className: 'vex-theme-teal'
        },
        {
          name: 'Green',
          className: 'vex-theme-green'
        },
        {
          name: 'Purple',
          className: 'vex-theme-purple'
        },
        {
          name: 'Red',
          className: 'vex-theme-red'
        },
        {
          name: 'Orange',
          className: 'vex-theme-orange'
        }
      ]
    }),
    provideNavigation(),
    provideIcons(),
    provideLuxon(),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['clean'],
          ['link', 'image']
        ]
      }
    }),
    provideNgxStripe(environment.stripeApiKey),
    // { 
    //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
    //   useValue: { 
    //     subscriptSizing: 'dynamic' 
    //   } 
    // }
  ]
};