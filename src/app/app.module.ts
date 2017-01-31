import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JsonpModule } from '@angular/http';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppComponent } from './app.component';
import { AuthorizeComponent } from './components/authorize.component';
import { ConfigureComponent } from './components/configure.component';
import { PrivacyComponent } from './components/privacy.component';
import { ProcessComponent } from './components/process.component';

import { InstagramService } from './services/instagram.service';
import { StateService } from './services/state.service';

import { AppRouting, AppRoutingProviders } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    FormsModule,
    JsonpModule,
    RouterModule.forRoot(AppRouting)
  ],
  declarations: [
    AppComponent,
    AuthorizeComponent,
    ConfigureComponent,
    PrivacyComponent,
    ProcessComponent
  ],
  providers: [
    AppRoutingProviders,
    CookieService,
    InstagramService,
    StateService,
    Title
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
