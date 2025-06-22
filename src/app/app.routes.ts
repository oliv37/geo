import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fra-dpt',
  },
  {
    path: 'usa-state',
    loadComponent: () =>
      import('./pages/usa-state-page/usa-state-page').then(
        (m) => m.UsaStatePage
      ),
  },
  {
    path: 'south-america',
    loadComponent: () =>
      import('./pages/south-america-page/south-america-page').then(
        (m) => m.SouthAmericaPage
      ),
  },
  {
    path: 'africa',
    loadComponent: () =>
      import('./pages/africa-page/africa-page').then((m) => m.AfricaPage),
  },
  {
    path: 'fra-dpt',
    loadComponent: () =>
      import('./pages/fra-dpt-page/fra-dpt-page').then((m) => m.FraDptPage),
  },
];
