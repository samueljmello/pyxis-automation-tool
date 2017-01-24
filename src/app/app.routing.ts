import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthorizeComponent } from './components/authorize.component';
import { ConfigureComponent } from './components/configure.component';
import { PrivacyComponent } from './components/privacy.component';
import { ProcessComponent } from './components/process.component';

export const AppRouting: Routes = [
  {
    path: '',
    component: ProcessComponent,
    data: {
      title: 'Process Feed'
    }
  },
  {
    path: 'configure',
    component: ConfigureComponent,
    data: {
      title: 'Configuration'
    }
  },
  {
    path: 'process',
    component: ProcessComponent,
    data: {
      title: 'Process Feed'
    }
  },
  {
    path: 'authorize',
    component: AuthorizeComponent,
    data: {
      title: 'Authorize Client'
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'Privacy Policy'
    }
  }
];

export const AppRoutingProviders: any[] = [];
