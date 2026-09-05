import { HttpInterceptorFn } from '@angular/common/http';

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Always include HttpOnly cookies across origins/proxy
  let modifiedReq = req.clone({
    withCredentials: true
  });

  // Extract XSRF-TOKEN from document cookie
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  const xsrfToken = match ? decodeURIComponent(match[1]) : null;

  // Append X-XSRF-TOKEN header for state-mutating requests
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (xsrfToken && mutatingMethods.includes(req.method.toUpperCase())) {
    modifiedReq = modifiedReq.clone({
      headers: modifiedReq.headers.set('X-XSRF-TOKEN', xsrfToken)
    });
  }

  return next(modifiedReq);
};
