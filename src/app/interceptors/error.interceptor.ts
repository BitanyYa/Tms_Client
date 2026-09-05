import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected system error occurred.';

      if (error.error && typeof error.error === 'object') {
        const problem = error.error as ProblemDetails;
        if (problem.detail) {
          errorMessage = problem.detail;
        } else if (problem.title) {
          errorMessage = problem.title;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error(`[HTTP Error ${error.status}]: ${errorMessage}`, error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
