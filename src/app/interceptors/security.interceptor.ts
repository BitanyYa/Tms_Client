import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Attach security headers to outgoing requests
  const modifiedReq = req.clone({
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[Security Interceptor] Session unauthorized (401). Redirecting to login.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        console.warn('[Security Interceptor] Forbidden access (403). Resource operation denied.');
      }
      return throwError(() => error);
    })
  );
};
