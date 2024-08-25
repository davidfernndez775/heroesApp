import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

// Función reutilizable para verificar la autenticación
const checkAuthStatus = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['./auth/login']);
      }
    })
  );
};

export const AuthGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const canMatch: CanMatchFn = () => {
  return checkAuthStatus();
};
