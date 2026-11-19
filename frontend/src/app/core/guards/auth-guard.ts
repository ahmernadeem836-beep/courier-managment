
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot
} from '@angular/router';

import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const requiredModule = route.data['module'] as string | undefined;

  if (requiredModule && !auth.hasAccess(requiredModule)) {
    return router.createUrlTree([
      auth.getDefaultRoute()
    ]);
  }

  return true;
};
