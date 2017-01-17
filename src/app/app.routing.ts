import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProcessComponent } from './components/process.component';
export const AppRouting: Routes = [
  {
    path: '',
    component: ProcessComponent,
    data: {
      title: 'Pyxis Social Automation Tool'
    }
  }
];

export const AppRoutingProviders: any[] = [];
