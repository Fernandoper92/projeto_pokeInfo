import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { SobreComponent, CardsComponent, CardDetailComponent } from './menu';

export const routes: Routes = [
    { path: '' , redirectTo: 'menu/cards' , pathMatch: 'full' },
    { path: 'menu/sobre', component: SobreComponent },
    { path: 'menu/cards', component: CardsComponent },
    { path: 'menu/cards/:id', component: CardDetailComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
