import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Pokemon } from 'src/app/shared/pokemon.model';
import { PokemonAPIService } from 'src/app/shared/pokemon-api.service';
import { CardDetailComponent } from '../card-detail/card-detail.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public pokemons: Pokemon[] = [];
  public colors: {};
  @ViewChild('pokemonDetail', { static: true }) pokemonDetail: CardDetailComponent;

  constructor(
    private router: Router,
    private pokemonService: PokemonAPIService
  ) { }

  ngOnInit(): void {
    this.getFavorites()
    this.colors = this.pokemonService.colors;
  }

  getFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favoritos'));
    favorites.forEach(id => {
      this.pokemonService.getFavoritesPokemons(parseInt(id, 10)).subscribe(favoritesData => {
        this.pokemons = favoritesData;
      });
    });

  }

  listFavorites() {
    const favorites = localStorage['favoritos']
    return favorites ? JSON.parse(favorites) : [];
  }

  selectPokemon(pokemon) {
    this.router.navigate(['menu/cards', pokemon.id]);
  }

  removeFavorite(id: number) {
    let favorites: number[] = this.listFavorites();
    favorites = favorites.filter(favorite => id !== favorite);
    this.setItemLocalStorage('favoritos', favorites);
    this.pokemonService.removeFromFavorites(id);
  }

  setItemLocalStorage(position: string, value: any) {
    localStorage.setItem(position, JSON.stringify(value));
  }

  openCardDetailComponent(pokemon) {
    this.pokemonDetail.pokemon = pokemon;
    this.pokemonDetail.openCardDetailComponent(pokemon);
  }
}
