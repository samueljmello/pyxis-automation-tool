import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
export const AppRouting: Routes = [
  {
    path: '',
    component: AppComponent,
    data: {
      title: 'Universal Angular App'
    }
  }
];

export const AppRoutingProviders: any[] = [
];
