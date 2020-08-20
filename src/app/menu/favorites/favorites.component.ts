import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Pokemon } from 'src/app/shared/pokemon.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public pokemons: Pokemon[] = this.listFavorites();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  listFavorites() {
    const favorites = localStorage['favoritos']
    return favorites ? JSON.parse(favorites) : [];
  }

  selectPokemon(pokemon) {
    this.router.navigate(['menu/cards', pokemon.id]);
  }

  removeFavorite(name: string) {
    let pokemons = this.pokemons

    pokemons.forEach(obj => {
      pokemons = pokemons.filter(pokemon => pokemon.name !== name)
    })

    this.pokemons = pokemons

    localStorage['favoritos'] = JSON.stringify(pokemons);
  }

}
