import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Evolution } from 'src/app/shared/evolution.model';
import { Pokemon } from 'src/app/shared/pokemon.model';
import { PokemonAPIService } from 'src/app/shared/pokemon-api.service';
import { Specie } from 'src/app/shared/specie.model';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  public pokemon: Pokemon;
  public specie: Specie;
  public description: string;
  public evolution: Evolution;
  public evolutionChain: Pokemon[] = [];
  public colors: {};


  constructor(private route: ActivatedRoute, private router: Router, private pokemonService: PokemonAPIService) {
  }

  ngOnInit(): void {
    this.colors = this.pokemonService.colors;
  }
 
  getPokemonByName(name) {
    let pokemon: Pokemon;
    this.pokemonService.getPokemonByName(name).subscribe(
      response => {
        pokemon = response;
        this.evolutionChain.push(pokemon);
        this.evolutionChain.sort((a, b) => a.order - b.order);
      });
  }

  getSpecie() {
    const pokemon = this.pokemon;
    this.pokemonService.getUrl(pokemon.species.url).subscribe((response: Specie) => {
      this.specie = response;
      this.getDescription();
      this.getEvolution();
    });
  }

  getDescription() {
    let description;
    description = this.specie.flavor_text_entries[0].flavor_text;
    this.description = description;
  }

  getEvolution() {
    const specie = this.specie;
    this.pokemonService.getUrl(specie.evolution_chain.url).subscribe((response: Evolution) => {
      this.evolution = response;
      this.getEvolutionChain();
    })
  }

  getEvolutionChain() {
    let evolution: Evolution = this.evolution;
    let evoName: string[] = [];
    let evolvesTo: [{}] = evolution.chain.evolves_to;

    function pushName(element) {
      evoName.push(element.species.name);
    };

    let name1 = evolution.chain;
    name1 ? pushName(name1) : null;

    if (evolvesTo.length > 1) {
      evolvesTo.forEach(pushName);

    } else {

      let name2 = evolution.chain.evolves_to[0];
      let name3 = evolution.chain.evolves_to[0]?.evolves_to[0];

      name2 ? pushName(name2) : null;
      name3 ? pushName(name3) : null;

    }

    evoName.forEach((name => {
      this.getPokemonByName(name)
    }));
  }

  openCardDetailComponent(pokemon) {
    this.pokemon = pokemon;
    let component = document.getElementById('show-modal');
    this.evolutionChain = [];
    this.getSpecie();
    component.classList.add('showModal');
  }

  closeCardDetailComponent(event) {
    const eventElement = event.toElement;
    const showModal = document.getElementById('show-modal');
    
    if (eventElement.classList.contains("close-modal")) {
      showModal.classList.remove('showModal');
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
