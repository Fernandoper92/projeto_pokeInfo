import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pokemon } from './pokemon.model';
import { Evolution } from './evolution.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonAPIService {

  public pokeUrl = 'https://pokeapi.co/api/v2/pokemon/';
  public evoUrl = 'https://pokeapi.co/api/v2/evolution-chain/';
  public specieUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
  public pokemon: Pokemon;
  public pokemons: Pokemon[] = [];
  public evoChain: Evolution;
  public evolutions: Evolution[] = [];
  public tempEvo: Evolution;

  constructor(private http: HttpClient) {}

  public getPokemon(pokeName, n): Observable<any> {
    const ref = pokeName ? pokeName : n;
    return this.http.get<Pokemon>(this.pokeUrl + ref);
  }

  public getSpecie(pokeName, n): Observable<any> {
    const ref = pokeName ? pokeName : n;
    return this.http.get<Pokemon>(this.specieUrl + ref);
  }

  public getEvolutions(n):Observable<any> {
       return this.http.get<Evolution>(this.evoUrl + n);
  }

  public getUrl(url):Observable<any> {
    return this.http.get<any>(url);
  }

}
