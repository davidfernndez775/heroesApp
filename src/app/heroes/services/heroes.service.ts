import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

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

  // funcion para crear un heroe, se usa el metodo post y se le pasa
  // la informacion del heroe en la variable hero
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  // funcion para actualizar un heroe, se usa el metodo patch, se le pasa
  // la informacion y es el backend el que se encarga de seleccionar los
  // campos que va a actualizar
  updateHero(hero: Hero): Observable<Hero> {
    // chequea que el id existe
    if (!hero.id) throw Error('Hero id is required');
    // se hace la peticion
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  // funcion para borrar un heroe, se usa el metodo delete, esto no significa
  // en el backend se haga un borrado, el backend es el que controla la base
  // de datos y se encarga de gestionar la logica de la peticion
  // en este caso el Observable no retorna un Hero sino un booleano para indicar
  // si el borrado fue exitoso o no
  deleteHero(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`).pipe(
      // si hay un error por fallo de conexion o porque el recurso ya fue borrado
      catchError((err) => of(false)),
      // si no hay error, devuelve el true, sin importar la respuesta del backend
      // porque se asume que la operacion de borrado fue exitosa
      map((resp) => true)
    );
  }
}
