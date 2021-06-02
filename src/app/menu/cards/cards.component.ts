import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Pokemon } from 'src/app/shared/pokemon.model';
import { PokemonAPIService } from 'src/app/shared/pokemon-api.service';
import { CardDetailComponent } from 'src/app/menu/card-detail/card-detail.component';
import { PokemonData } from 'src/app/shared/data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @ViewChildren('starFavorite') starFavorites: QueryList<ElementRef>;

  public busca = new FormControl('');
  public geracao = new FormControl('');
  public pokemon: Pokemon;
  public pokemons: Pokemon[] = [];
  public pokemonTemp: Pokemon[] = [];
  public geracoes = this.pokemonService.geracoes;
  private inscricao1: Subscription;
  private inscricao2: Subscription;
  @ViewChild('pokemonDetail', { static: true }) pokemonDetail: CardDetailComponent;
  startLoadPokemon = 1;
  qtdPokemonLoad = 30;

  constructor(
    private pokemonService: PokemonAPIService,
    private render: Renderer2
  ) { }

  ngOnInit(): void {
    this.getPokemonsByNumber();
    this.reactiveFilter();
  }

  getPokemons(data) {
    this.pokemons = data;
    this.pokemons.sort((a, b) => a.id - b.id);
    setTimeout(() => this.setFavorites(), 1000);
  }

  getPokemonsByNumber(arrStart: number = this.startLoadPokemon, arrEnd: number = this.qtdPokemonLoad, reset: boolean = false) {
    this.inscricao1 = this.pokemonService.getPokemon(arrStart, arrEnd, reset)
      .subscribe(data => {
        this.getPokemons(data);
      });
    this.checkArraynumbers(arrEnd);
  }

  checkArraynumbers(arrEnd) {
    this.startLoadPokemon = arrEnd + 1;
    if (this.startLoadPokemon >= 386) this.startLoadPokemon = 386;
    this.qtdPokemonLoad = arrEnd + 30;
    if (this.qtdPokemonLoad >= 386) this.qtdPokemonLoad = 386;
  }


  pokemonsNameToObject(filterWord) {
    let temp;
    let count = 0;
    let allPokemonsData: PokemonData[];
    this.pokemonService.getAllPokemonsName().subscribe(response => {
      temp = response;
      allPokemonsData = temp.results;
      allPokemonsData.forEach((pokemon: PokemonData) => {
        if (pokemon.name.includes(filterWord)) {
          this.getPokemonsByName(pokemon.name);
          count++;
        }
      });
      if (count === 0) { this.pokemons = null }
    })
  }

  getPokemonsByName(name) {
    this.inscricao2 = this.pokemonService.getSearchByNamePokemon(name).subscribe(data => {
      this.getPokemons(data);
    })
  }

  reactiveFilter() {
    this.busca.valueChanges.pipe(
      map(value => value.trim()),
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe((filterWord: string) => {
      if (this.busca.value) {
        this.inscricao1.unsubscribe();
        this.pokemonsNameToObject(filterWord);
        return;
      } else {
        this.inscricao2.unsubscribe();
        this.getPokemonsByNumber();
      }
    })
  }

  generationFilter(value: number) {
    if (!value) value = 0;
    const geracao = this.geracoes[value];
    this.getPokemonsByNumber(geracao.arrStart, geracao.arrEnd, true);
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  paintStar(addFavorite: boolean, starFavorite: ElementRef) {
    this.render.removeClass(starFavorite, 'is-favorite');
    this.render.removeClass(starFavorite, 'not-favorite');
    if (addFavorite) {
      this.render.addClass(starFavorite, 'is-favorite');
    } else {
      this.render.addClass(starFavorite, 'not-favorite');
    }
  }

  setFavorites() {
    const listFavorites = JSON.parse(localStorage.getItem('favoritos')) as number[];
    if (listFavorites) {

      this.starFavorites.forEach((card: ElementRef) => {
        const pokeId = card.nativeElement.id.split('-')[1];
        listFavorites.forEach(idFavorite => {
          if (idFavorite === parseInt(pokeId, 10)) {
            this.render.addClass(card.nativeElement, 'is-favorite');
            this.render.removeClass(card.nativeElement, 'not-favorite');
          }
        });
      });
    }
  }

  listFavorites() {
    const favorites = localStorage.getItem('favoritos');
    return favorites ? JSON.parse(favorites) : [];
  }

  isFavorite(id: number) {
    let isFavorite: boolean = false;
    const favorites = this.listFavorites();

    const index = favorites.findIndex(findId => findId === id);
    isFavorite = index >= 0 ? true : false;
    return isFavorite;
  }

  onFavoriteClick(id: number, starFavorite: ElementRef) {
    let favorites: number[] = this.listFavorites();
    const isFavorite = this.isFavorite(id);
    if (isFavorite) {
      favorites = favorites.filter(favorite => id !== favorite);
      this.setItemLocalStorage('favoritos', favorites);
      this.paintStar(false, starFavorite);
      this.pokemonService.removeFromFavorites(id);
    } else {
      favorites.push(id);
      this.setItemLocalStorage('favoritos', favorites);
      this.paintStar(true, starFavorite);

    }
  }

  setItemLocalStorage(position: string, value: any) {
    localStorage.setItem(position, JSON.stringify(value));
  }

  savePokemon(pokemon) {
    this.setItemLocalStorage('pokemon', pokemon);
  }

  openCardDetailComponent(pokemon) {
    this.pokemonDetail.openCardDetailComponent(pokemon);
  }
}