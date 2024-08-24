import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environments.baseUrl;
  // el usuario se coloca como private porque fuera de este servicio el
  // usuario no debe ser modificado
  private user?: User;

  constructor(private http: HttpClient) {}

  // para acceder al usuario privado se usa un getter
  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    // como no podemos devolver directamente el objeto enviamos una copia
    // se puede usar el spread operator(...) o la funcion structuredClone
    // que es mas reciente a partir de Node 17
    return structuredClone(this.user);
  }

  // funcion para hacer login
  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      // recibe el usuario
      tap((user) => {
        this.user = user;
      }),
      // guarda el usuario en el almacenamiento local
      tap((user) => {
        localStorage.setItem('token', user.id.toString());
      })
    );
  }

  // funcion para chequear el estado de autenticacion
  checkAuthentication(): Observable<boolean> | boolean {
    // si no hay un token guardado en el localStorage, no esta autenticado
    if (!localStorage.getItem('token')) return of(false);
    // si hay un token
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!user),
      catchError((err) => of(false))
    );
  }

  // funcion para hacer logout
  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
