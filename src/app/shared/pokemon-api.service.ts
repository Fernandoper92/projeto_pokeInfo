import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Pokemon } from './pokemon.model';
import { Evolution } from './evolution.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonAPIService {

  public pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
  public evolutionUrl = 'https://pokeapi.co/api/v2/evolution-chain/';
  public specieUrl = 'https://pokeapi.co/api/v2/pokemon-species/';

  public listPokemons$ = new BehaviorSubject<Pokemon[]>([]);
  public listFavorites$ = new BehaviorSubject<Pokemon[]>([]);
  public listSearchPokemon$ = new BehaviorSubject<Pokemon[]>([]);

  constructor(private http: HttpClient) { }

  colors = {
    fire: '#F08030',
    grass: '#78C850',
    electric: '#F8D030',
    water: '#6890F0',
    ground: '#E0C068',
    rock: '#B8A038',
    fairy: '#EE99AC',
    poison: '#A040A0',
    bug: '#A8B820',
    dragon: '#7038F8',
    psychic: '#F85888',
    flying: '#A890F0',
    fighting: '#C03028',
    normal: '#A8A878'
  }

  geracoes = [
    { id: 0, arrStart: 1, arrEnd: 30, regiao: "", geracao: "Todas as Gerações" },
    { id: 1, arrStart: 1, arrEnd: 30, regiao: "Kanto", geracao: "I - Red, Green, Blue e Yellow" },
    { id: 2, arrStart: 152, arrEnd: 182, regiao: "Johto", geracao: "II - Gold, Silver e Crystal" },
    { id: 3, arrStart: 252, arrEnd: 282, regiao: "Hoenn", geracao: "III - Ruby, Sapphire e Emerald" },
    // { id: 3, arrStart: 387, arrEnd: 463, regiao: "Sinnoh", geracao: "IV - Diamond, Pearl e Platinum" },
    // { id: 4, arrStart: 494, arrEnd: 649, regiao: "Unova", geracao: "V - Black e White" },
    // { id: 5, arrStart: 650, arrEnd: 721, regiao: "Kalos", geracao: "VI - X e Y" },
    // { id: 6, arrStart: 722, arrEnd: 809, regiao: "Alola", geracao: "VII - Sun, Moon" },
    // { id: 7, arrStart: 810, arrEnd: 890, regiao: "Galar", geracao: "VIII - Sword e Shield" },
  ]

  public getAllPokemonsName() {
    return this.http.get(`${this.pokemonUrl}?limit=386`);
  }

  public getPokemon(arrStart: number, arrEnd: number, reset: boolean = false): Observable<any> {
    if (reset)  this.listPokemons$ = new BehaviorSubject<Pokemon[]>([]);
    for (let id = arrStart; id <= arrEnd; id++) {
      const index = this.listPokemons$.getValue().findIndex(findPokemon => findPokemon.id === id);
      if (index === -1) {
        this.http.get(`${this.pokemonUrl}${id}`).subscribe(
          (response: Pokemon) => {
            this.listPokemons$.getValue().push({
              height: (response.height / 10),
              id: response.id,
              moves: response.moves,
              name: response.name,
              order: response.order,
              species: response.species,
              sprites: response.sprites,
              types: response.types,
              weight: (response.weight / 10)
            });
            this.listPokemons$.getValue().sort((a, b) => a.id - b.id);
          }
        );
      } 
      if (id === arrEnd) return this.listPokemons$.asObservable();
    }
  }

  getPokemonByName(name): Observable<any> {
    return this.http.get<Pokemon>(`${this.pokemonUrl}${name}`);
  }

  getFavoritesPokemons(id: number): Observable<Pokemon[]> {
    const listFavorite = this.listFavorites$.getValue();
    const index = listFavorite.findIndex(pokemon => pokemon.id === id);
    if (index === -1) {
      this.http.get(`${this.pokemonUrl}${id}`).subscribe((response: Pokemon) => {
        {
          this.listFavorites$.getValue().push({
            height: (response.height / 10),
            id: response.id,
            moves: response.moves,
            name: response.name,
            order: response.order,
            species: response.species,
            sprites: response.sprites,
            types: response.types,
            weight: (response.weight / 10)
          });
          this.listFavorites$.getValue().sort((a, b) => a.id - b.id);
        }
      });
    }

    return this.listFavorites$.asObservable();
  }

  getSearchByNamePokemon(name: string): Observable<Pokemon[]> {
    this.listSearchPokemon$ = new BehaviorSubject<Pokemon[]>([]);
    const index = this.listSearchPokemon$.getValue().findIndex(findPokemon => findPokemon.name === name);
    if (index === -1) {
      this.http.get(`${this.pokemonUrl}${name}`).subscribe(
        (response: Pokemon) => {
          this.listSearchPokemon$.getValue().push({
            height: (response.height / 10),
            id: response.id,
            moves: response.moves,
            name: response.name,
            order: response.order,
            species: response.species,
            sprites: response.sprites,
            types: response.types,
            weight: (response.weight / 10)
          });
          this.listSearchPokemon$.getValue().sort((a, b) => a.id - b.id);
        }
      );
    }
    return this.listSearchPokemon$.asObservable();
  }

  removeFromFavorites(id: number) {
    const listFavorite = this.listFavorites$.getValue();
    const index = listFavorite.findIndex(pokemon => pokemon.id === id);
    if (index >= 0) {
      listFavorite.splice(index, 1);
    }
  }

  public getUrl(url): Observable<any> {
    return this.http.get<any>(url);
  }

}
