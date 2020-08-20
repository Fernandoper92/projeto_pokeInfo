import { Component, OnInit } from '@angular/core';
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
  public evoChain: Pokemon[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private pService: PokemonAPIService) {
  }

  ngOnInit(): void {
  }

  log(){
    console.log('works')
  }

  getPokemon() {
    const pokemon = localStorage['pokemon']
    this.pokemon = pokemon ? JSON.parse(pokemon) : '';
  }

  getPokemonByName(name) {
    console.log(name)
    this.pService.getPokemon(name, null).subscribe((response: Pokemon) => {
      response.name = this.capitalizeFirstLetter(response.name);
      this.evoChain.push(response);
      this.evoChain.sort((a, b) => a.order - b.order);
    });
  }

  getSpecie() {
    const pokemon = this.pokemon;
    this.pService.getUrl(pokemon.species.url).subscribe((response: Specie) => {
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
    this.pService.getUrl(specie.evolution_chain.url).subscribe((response: Evolution) => {
      this.evolution = response;
      this.getChain();
    })
  }

  getChain() {
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

    evoName.forEach((obj => {
      this.getPokemonByName(obj)
    }));
  }

  closeCardDetailComponent(event) {
    const eventElement = event.toElement;
    const overlayElement = document.getElementById('overlay');
    const buttonElement = document.getElementById('close-button');
    const overlayComponent = document.getElementById('show-overlay')

    if (eventElement === overlayElement || eventElement === buttonElement) {
      overlayComponent.style.display = "none"
    }
  }

  openCardDetailComponent() {
    this.getPokemon();
    let component = document.getElementById('show-overlay');
    this.evoChain = [];
    this.getSpecie();
    component.style.display = "block";
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
