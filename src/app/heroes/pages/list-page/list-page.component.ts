import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``,
})
export class ListPageComponent implements OnInit {
  // creamos la variable para guardar la lista
  public heroes: Hero[] = [];
  // inyectamos el servicio
  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    // nos suscribimos al observable y obtenemos la lista
    this.heroesService
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes));
  }
}
