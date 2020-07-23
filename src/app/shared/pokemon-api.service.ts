import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Pokemon, Evolution } from '.';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonAPIService {

  public pokeUrl = 'https://pokeapi.co/api/v2/pokemon/';
  public evoUrl = 'https://pokeapi.co/api/v2/evolution-chain/';
  public pokemon: Pokemon;
  public pokemons: Pokemon[] = [];
  public evoChain: Evolution;
  public evolutions: Evolution[] = [];
  public tempEvo: Evolution;

  constructor(private http: HttpClient) { }

  public getList():Observable<any> {
    return this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=3&offset=0');
  }

  public getPokemons(n):Observable<any> {
      return  this.http.get<any>(this.pokeUrl + n);
  }

  public getPokemonByName(pokeName): Observable<any> {
    return this.http.get<Pokemon>(this.pokeUrl + pokeName);
  }

  public getEvolutions() {
    if (this.evolutions.length === 0) {
      for (let n = 1; n <= 20; n++) {
        this.http.get<Evolution>(this.evoUrl + n.toString())
          .subscribe(
            (response: Evolution) => {
              this.evolutions.push({
                chain: {
                  evolution_details: response.chain.evolution_details,
                  evolves_to: response.chain.evolves_to,
                  species: {
                    name: response.chain.species.name,
                    url: response.chain.species.url
                  }
                },
                id: response.id
              });
              this.evolutions.sort((a, b) => a.id - b.id);
            }
          )
      }
    }
  }

  getEvolution(pokemonName) {
    let tempEvo: Evolution;

    this.evolutions.forEach(function (response) {

      if (response.chain.evolves_to[0].evolves_to[0]) {
        if (response.chain.species.name === pokemonName ||
          response.chain.evolves_to[0].species.name === pokemonName ||
          response.chain.evolves_to[0].evolves_to[0].species.name === pokemonName) {
          tempEvo = response;
        }
      } else {
        if (response.chain.species.name === pokemonName ||
          response.chain.evolves_to[0].species.name === pokemonName) {
          tempEvo = response;
          tempEvo.chain.evolves_to[0].evolves_to[0] = null;
        }
      }
    });
    this.evoChain = tempEvo;
  }

}
