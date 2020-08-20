import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { SobreComponent } from './menu/sobre/sobre.component';
import { CardsComponent } from './menu/cards/cards.component';
import { FavoritesComponent } from './menu/favorites/favorites.component';

export const routes: Routes = [
    { path: '' , redirectTo: 'inicio' , pathMatch: 'full' },
    { path: 'inicio/favoritos', component: FavoritesComponent },
    { path: 'inicio/sobre', component: SobreComponent },
    { path: 'inicio', component: CardsComponent },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
