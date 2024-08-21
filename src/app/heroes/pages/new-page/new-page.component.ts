import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent {
  // definimos un formulario con varios campos
  public heroForm = new FormGroup({
    // por defecto Angular asume el tipo de dato de cada campo
    id: new FormControl<string>(''), // a cada campo se le puede especificar el tipo de dato
    superhero: new FormControl<string>('', { nonNullable: true }), // se añaden atributos
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(),
    first_appearance: new FormControl(),
    characters: new FormControl(),
    alt_img: new FormControl(),
  });
  // agregamos contenido para visualizacion de inputs especiales
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  // injectamos el servicio que va a recibir el formulario
  constructor(private heroesService: HeroesService) {}

  // tomamos los datos del formulario
  get currentHero(): Hero {
    // es necesario agregar as Hero porque algunos campos del formulario
    // pueden ser null por tanto no se corresponden con la interface Hero
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  // definimos la funcion que controla el formulario
  onSubmit(): void {
    // si el formulario es invalido no pasa nada
    if (this.heroForm.invalid) return;
  }
}
