import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'africa',
    loadComponent: () =>
      import('./africa/africa-page/africa-page').then((m) => m.AfricaPage),
  },
  {
    path: 'france-dpt',
    loadComponent: () =>
      import('./france-dpt/france-dpt-page/france-dpt-page').then(
        (m) => m.FranceDptPage,
      ),
  },
  {
    path: 'south-america',
    loadComponent: () =>
      import('./south-america/south-america-page/south-america-page').then(
        (m) => m.SouthAmericaPage,
      ),
  },
  {
    path: 'usa',
    loadComponent: () =>
      import('./usa/usa-page/usa-page').then((m) => m.UsaPage),
  },
];
