import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Link {
  label: string;
  url: string;
}

@Component({
  selector: 'geo-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected links: Link[] = [
    {
      label: 'France Métropolitaine (départements)',
      url: '/france-dpt',
    },
    {
      label: 'États-Unis',
      url: '/usa',
    },
    {
      label: 'Afrique',
      url: '/africa',
    },
  ];
}
