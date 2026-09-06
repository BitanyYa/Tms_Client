import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { xsrfInterceptor } from './interceptors/xsrf.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { securityInterceptor } from './interceptors/security.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([xsrfInterceptor, securityInterceptor, errorInterceptor])
    ),
  ],
};
