import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { SobreComponent } from './menu/sobre/sobre.component';
import { CardsComponent } from './menu/cards/cards.component';
import { FavoritesComponent } from './menu/favorites/favorites.component';

export const routes: Routes = [
    { path: '' , redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'favoritos', component: FavoritesComponent },
    { path: 'sobre', component: SobreComponent },
    { path: 'pokemons', component: CardsComponent },
    { path: '**', redirectTo: 'pokemons', pathMatch: 'full' }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
