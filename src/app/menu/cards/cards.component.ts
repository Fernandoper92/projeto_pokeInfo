import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Pokemon, PokemonAPIService } from 'src/app/shared';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  public name = new FormControl('');
  public pokemons: Pokemon[] = [];
  public pTemp: Pokemon[] = [];

  constructor(private http: HttpClient, private router: Router, private pService: PokemonAPIService) { }

  ngOnInit(): void {
    this.getPokemons(1, 151);
    this.pFilter();
  }
  //===========================================================

  //salvar a array no sessionStorage deixa a aplicação lenta

  //===========================================================


  getPokemons(arrStart: number, arrEnd: number) {
    if (sessionStorage['pTemp']) {
      this.pokemons = sessionStorage['pTemp'];
    } else {
      for (let n = arrStart; n <= arrEnd; n++) {
        this.pService.getPokemons(n).subscribe(
          (response: Pokemon) => {
            this.pTemp.push(response)
            this.pTemp.sort((a, b) => a.id - b.id)
            sessionStorage['pTemp'] = JSON.stringify(this.pTemp)
          }
        );
      }
      this.pokemons = this.pTemp;

    }
  }

  pFilter() {
    this.name.valueChanges.pipe(
      map(value => value.trim()),
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe((param: string) => {
      this.pokemons = this.pTemp.filter(filter => filter.name.indexOf(param) >= 0);

      if (param.length === 0) {
        this.pokemons = this.pTemp
      }
    });
  }

  onSelect(pokemon) {
    this.router.navigate(['menu/cards', pokemon.id]);
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


}