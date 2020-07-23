import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { PokemonAPIService, Pokemon, Evolution } from 'src/app/shared';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  public pokemonId: number;
  public pokemon: Pokemon;
  public evoChain: Pokemon[] = [];
  public evolution: Evolution;


  constructor(private route: ActivatedRoute, private router: Router, private pService: PokemonAPIService) {
  }

  ngOnInit(): void {

    this.getId();
    this.getPokemon(this.pokemonId);
    this.getEvo(this.pokemon.name);
    this.getEvoChain(this.evolution);
    this.changeButton(this.pokemonId);
  }

  getId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('id'));
      this.pokemonId = id;
    });
  }

  getPokemon(pokemonId: number) {
    this.pokemon = this.pService.pokemons[pokemonId - 1];
  }

  getEvo(pokemonName) {
    this.pService.getEvolution(pokemonName);
    this.evolution = this.pService.evoChain;
  }

  getEvoChain(evolution: Evolution) {

    let firstEvo = evolution.chain.species.name
    let secondEvo = evolution.chain.evolves_to[0].species.name

    this.pService.getPokemonByName(firstEvo).subscribe((response: Pokemon) => {
      this.evoChain[0] = response;
    });
    this.pService.getPokemonByName(secondEvo).subscribe((response: Pokemon) => {
      this.evoChain[1] = response;
    });
    if (this.evolution.chain.evolves_to[0].evolves_to[0]) {

      let thirdEvo = evolution.chain.evolves_to[0].evolves_to[0].species.name

      this.pService.getPokemonByName(thirdEvo).subscribe((response: Pokemon) => {
        this.evoChain[2] = response;
      });
    } else {
      this.evoChain[2] = null;
    }
  }

  goPrevious() {
    let previousId = this.pokemonId - 1;
    this.getPokemon(previousId);
    this.getEvo(this.pokemon.name);
    this.getEvoChain(this.evolution);
    this.router.navigate(['menu/cards', previousId]);
    this.changeButton(previousId);
  }

  goNext() {
    let nextId = this.pokemonId + 1;
    this.getPokemon(nextId);
    this.getEvo(this.pokemon.name);
    this.getEvoChain(this.evolution);
    this.router.navigate(['menu/cards', nextId]);
    this.changeButton(nextId);
  }

  changeButton(n) {
    if (n === 1) {
      let button = document.getElementById('button-previous')
      button.classList.add("disabled");
      button.setAttribute('disabled', 'disabled');
    } else {
      let button = document.getElementById('button-previous')
      button.classList.remove("disabled");
      button.removeAttribute('disabled');
    }
    if (n === this.pService.pokemons.length) {
      let button = document.getElementById('button-next')
      button.classList.add("disabled");
      button.setAttribute('disabled', 'disabled');
    } else {
      let button = document.getElementById('button-next')
      button.classList.remove("disabled");
      button.removeAttribute('disabled');
    }
  }

  back() {
    this.router.navigate(['menu/cards']);
  }
}
