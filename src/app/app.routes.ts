import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'france-dpt',
  },
  /*
  {
    path: 'usa-state',
    loadComponent: () =>
      import('./usa/usa-page/usa-page').then((m) => m.UsaPage),
  },
  {
    path: 'south-america',
    loadComponent: () =>
      import('./south-america/south-america-page/south-america-page').then(
        (m) => m.SouthAmericaPage
      ),
  },
  {
    path: 'africa',
    loadComponent: () =>
      import('./africa/africa-page/africa-page').then((m) => m.AfricaPage),
  },
  */
  {
    path: 'france-dpt',
    loadComponent: () =>
      import('./france-dpt/france-dpt-page/france-dpt-page').then(
        (m) => m.FranceDptPage
      ),
  },
];
