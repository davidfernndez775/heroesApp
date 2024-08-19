import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { environments } from '../../../environments/environments';
import { Hero } from '../interfaces/hero.interface';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  // se carga la direccion desde la variable environment
  private baseUrl: string = environments.baseUrl;
  // se inicia el constructor con el servicio http
  constructor(private http: HttpClient) {}
  // funcion que va a la vista de lista
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }
  // funcion que va a la vista detalle
  getHeroesById(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }
  // funcion para las sugerencias del buscador
  getSuggestions(query: string): Observable<Hero[]> {
    // se pasa la direccion para la peticion get con las query strings
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }
}
