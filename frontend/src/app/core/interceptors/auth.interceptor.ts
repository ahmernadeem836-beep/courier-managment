
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublicMerchantSignup = req.url.includes(
    '/api/merchant-applications'
  );

  if (isPublicMerchantSignup) {
    return next(req);
  }

  const token = localStorage.getItem('courier_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  }

  return next(req);
};
