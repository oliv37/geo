import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'usa-state',
  },
  {
    path: 'usa-state',
    loadComponent: () =>
      import('./pages/usa-state-page/usa-state-page').then(
        (m) => m.UsaStatePage
      ),
  },
];
