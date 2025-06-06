import { Component, Directive, input } from '@angular/core';

@Directive()
export abstract class AbstractMap {
  className = input<string>('');
}
