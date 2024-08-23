import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from './../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
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
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // tomamos los datos del formulario
  get currentHero(): Hero {
    // es necesario agregar as Hero porque algunos campos del formulario
    // pueden ser null por tanto no se corresponden con la interface Hero
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  // tanto la pagina de creacion como la de actualizacion comparten la misma page
  // por tanto es necesario saber cuando el formulario va a aparecer vacio
  // para un create o con los datos de un heroe para un update
  ngOnInit(): void {
    // si la direccion no incluye el termino 'edit' vamos a hacer una creacion
    if (!this.router.url.includes('edit')) return;

    // si lo anterior no ocurre vamos a realizar un update por tanto hay que
    // cargar los datos del heroe en el formulario
    this.activatedRoute.params
      .pipe(
        // el switchMap recibe el id desde el url y crea un nuevo observable
        // haciendo una peticion al servicio para que le mande los datos
        // del heroe
        switchMap(({ id }) => this.heroesService.getHeroesById(id))
      )
      .subscribe((hero) => {
        // si no existe un heroe retornamos a la pagina principal
        if (!hero) return this.router.navigateByUrl('/');
        // si existe un heroe usamos la funcion reset para que tome sus valores
        this.heroForm.reset(hero);
        return;
      });
  }

  // definimos la funcion que controla el formulario
  onSubmit(): void {
    // si el formulario es invalido no pasa nada
    if (this.heroForm.invalid) return;

    // si los datos del formulario contienen un id se hace un update
    if (this.currentHero.id) {
      // llamamos a la funcion del servicio y nos suscribimos al observable
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} is updated`);
      });
      return;
    }

    // si no se ejecutan ninguno de los if anteriores significa que tenemos
    // un formulario valido sin un id entre sus datos por tanto se hace un create
    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      // redireccionamos a la vista de edicion
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} created!`);
    });
  }

  // funcion que controla la ventana de dialogo(popup) para confirmar
  // la eliminacion
  onDeleteHero() {
    // se chequea que exista el id
    if (!this.currentHero.id) throw Error('Hero id is required');

    // abrimos la ventana de dialogo y se le pasan los datos del heroe
    // por si son necesarios
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    // una vez que el usuario escoge la opcion se realiza el cerrado de
    // la ventana y se ejecutan las acciones escogidas
    dialogRef
      .afterClosed()
      .pipe(
        // se chequea que el resultado sea true
        filter((result: boolean) => result),
        // se llama a la funcion de borrado en el servicio
        switchMap(() => this.heroesService.deleteHero(this.currentHero.id)),
        // se chequea que el borrado fue exitoso
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        // una vez confirmado el borrado
        this.router.navigate(['/heroes']);
      });
  }

  // los snackbar son ventanas pequeñas que informan de procesos, al ser
  // sencillas no requieren crear un componente para ellas
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', { duration: 2500 });
  }
}
