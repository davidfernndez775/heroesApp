import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``,
})
export class HeroPageComponent implements OnInit {
  public hero?: Hero;
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params
      // tomamos el id de la direccion url y se lo pasamos al servicio
      .pipe(switchMap(({ id }) => this.heroesService.getHeroesById(id)))
      .subscribe((hero) => {
        // si no existe el heroe redireccionamos a la vista lista
        if (!hero) return this.router.navigate(['/heroes/list']);
        // si existe lo asignamos
        this.hero = hero;
        return;
      });
  }
  goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }
}
