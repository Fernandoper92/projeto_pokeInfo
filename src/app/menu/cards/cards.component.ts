import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Pokemon } from 'src/app/shared/pokemon.model';
import { PokemonAPIService } from 'src/app/shared/pokemon-api.service';
import {  CardDetailComponent } from 'src/app/menu/card-detail/card-detail.component'

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  public items = [
    { id: 0, arrStart: 1, arrEnd: 151, regiao: "Kanto", geracao: "I - Red, Green, Blue e Yellow" },
    { id: 1, arrStart: 152, arrEnd: 251, regiao: "Johto", geracao: "II - Gold, Silver e Crystal" },
    { id: 2, arrStart: 252, arrEnd: 386, regiao: "Hoenn", geracao: "III - Ruby, Sapphire e Emerald" },
    // { id: 3, arrStart: 387, arrEnd: 463, regiao: "Sinnoh", geracao: "IV - Diamond, Pearl e Platinum" },
    // { id: 4, arrStart: 494, arrEnd: 649, regiao: "Unova", geracao: "V - Black e White" },
    // { id: 5, arrStart: 650, arrEnd: 721, regiao: "Kalos", geracao: "VI - X e Y" },
    // { id: 6, arrStart: 722, arrEnd: 809, regiao: "Alola", geracao: "VII - Sun, Moon" },
    // { id: 7, arrStart: 810, arrEnd: 890, regiao: "Galar", geracao: "VIII - Sword e Shield" },
  ]

  public busca = new FormControl('');
  public geracao = new FormControl('');
  public pokemon: Pokemon;
  public pokemons: any[] = [];
  public pTemp: Pokemon[] = [];
  @ViewChild(CardDetailComponent) pokemonDetail;
  filtro: string;

  constructor(private http: HttpClient, private router: Router, private pService: PokemonAPIService) { }

  ngOnInit(): void {
    this.getPokemons(1, 386);
    // this.pFilter();
    this.pGeneration();
  }

  getPokemons(arrStart: number, arrEnd: number) {
    for (let n = arrStart; n <= arrEnd; n++) {
      this.pService.getPokemon(null, n).subscribe(
        (response: Pokemon) => {
          this.pTemp.push({
            height: (response.height / 10),
            id: response.id,
            moves: response.moves,
            name: this.capitalizeFirstLetter(response.name),
            order: response.order,
            species: response.species,
            sprites: response.sprites,
            types: response.types,
            weight: (response.weight / 10)
          })
          this.pTemp.sort((a, b) => a.id - b.id)
        }
      );
    }
    this.pokemons = this.pTemp;
  }

  getPokemonById(id) {
    this.pService.getPokemon(null, id).subscribe((response: Pokemon) => {
      response.name = this.capitalizeFirstLetter(response.name);
      this.pokemon = response;
    });
  }

  // pFilter() {
  //   this.busca.valueChanges.pipe(
  //     map(value => value.trim()),
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //   ).subscribe((param: string) => {
  //     this.pokemons = this.pokemons.filter(filter => filter.name.indexOf(param) >= 0);

  //     if (param.length === 0) {
  //       this.pokemons = this.pTemp
  //     }
  //   });
  // }

  filterPokemon() {
    if (this.pokemons.length === 0 || this.filtro === undefined || this.filtro.trim() === '') {
      return this.pokemons;
    }
    return this.pokemons.filter((v) => {
     let result = v.name.toLowerCase().includes(this.filtro.toLowerCase())
     return result
    });
  }

  pGeneration() {
    this.geracao.valueChanges.subscribe((param) => {
      const obj = this.items[param]
      if (this.geracao.value != "") {
        this.pokemons = this.pTemp.filter(filter => filter.id >= obj.arrStart && filter.id <= obj.arrEnd);
        this.pokemons = this.pokemons.sort((a, b) => a.id - b.id);
      } else {
        this.pokemons = this.pTemp;
      }
    });
  }

  mouseOver(id) {
    let tooltip = document.getElementById(id);
    window.onmousemove = function (e) {
      let y = e.clientY;
      let x = e.clientX;
      tooltip.style.top = (y + 20) + 'px';
      tooltip.style.left = (x + 20) + 'px';
    }
  }

  mouseOut() {
    window.onmousemove = null;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  listFavorites() {
    const favorites = localStorage['favoritos']
    return favorites ? JSON.parse(favorites) : [];
  }

  isFavorite(name: string) {
    let isFavorite: boolean = false;
    const favorites = this.listFavorites();

    favorites.forEach((obj) => {
      if (obj.name == name) isFavorite = true;
    });
    return isFavorite
  }

  onFavoriteClick(pokemonobj) {
    let favorites: Pokemon[] = this.listFavorites()
    const pokemon = pokemonobj
    const pokemonName = pokemon.name;

    if (this.isFavorite(pokemonName)) {
      favorites = favorites.filter(favorite => pokemonName !== favorite.name)
      localStorage['favoritos'] = JSON.stringify(favorites);

    } else {
      favorites.push(pokemon)
      localStorage['favoritos'] = JSON.stringify(favorites);

    }
  }

  savePokemon(pokemon) {
    localStorage['pokemon'] = JSON.stringify(pokemon);
  }

  openCardDetailComponent(pokemon) {
    this.savePokemon(pokemon);
    this.pokemonDetail.openCardDetailComponent();
  }
}