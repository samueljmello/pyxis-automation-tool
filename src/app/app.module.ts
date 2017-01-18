import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ProcessComponent } from './components/process.component';

import { HttpService } from './services/http.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppRouting, AppRoutingProviders } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    FormsModule,
    RouterModule.forRoot(AppRouting)
  ],
  declarations: [
    AppComponent,
    ProcessComponent
  ],
  providers: [
    AppRoutingProviders,
    HttpService,
    CookieService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
