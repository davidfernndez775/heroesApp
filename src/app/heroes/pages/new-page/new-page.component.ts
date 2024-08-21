import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Publisher } from '../../interfaces/hero.interface';

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

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];
}
