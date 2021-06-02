import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardsComponent } from './cards/cards.component';
import { SobreComponent } from './sobre/sobre.component';
import { MenuComponent } from './menu.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { PokemonAPIService } from '../shared/pokemon-api.service';
import { FavoritesComponent } from './favorites/favorites.component';
import { CamelCasePipe } from '../shared/camel-case.pipe';



@NgModule({
  declarations: [
    MenuComponent,
    SobreComponent,
    CardsComponent,
    CardDetailComponent,
    FavoritesComponent,
    CamelCasePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    MenuComponent
  ],
  providers: [
    PokemonAPIService
  ]
})
export class MenuModule { }
