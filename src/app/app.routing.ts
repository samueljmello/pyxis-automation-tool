import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
export const AppRouting: Routes = [
  {
    path: '',
    component: AppComponent,
    data: {
      title: 'Pyxis Automation Tool'
    }
  },
  {
    path: 'config',
    component: ConfigComponent,
    data: {
      title: 'Configure the App'
    }
  }
];

export const AppRoutingProviders: any[] = [
];
