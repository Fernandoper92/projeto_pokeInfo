import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardsComponent } from './cards';
import { SobreComponent } from './sobre';
import { MenuComponent } from './menu.component';
import { PokemonAPIService } from '../shared';
import { CardDetailComponent } from './card-detail/card-detail.component';



@NgModule({
  declarations: [
    MenuComponent,
    SobreComponent,
    CardsComponent,
    CardDetailComponent
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
