import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';

import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { AccountModel } from '../models/account.model';

@Component({
  selector: 'authorize-component',
  templateUrl: 'authorize.component.html'
})
export class AuthorizeComponent implements OnInit {

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private router: Router,
    private state: StateService
  ) {}

  public ngOnInit() {
    let settings = this.state.settings;
    const authArray = this.cookie.get('authArray');
    const accessToken: string = this.router.parseUrl(this.router.url).fragment.replace('access_token=','');
    if (accessToken) {
      this.instagram.getSelf(accessToken).subscribe(
        (response) => {
          const newAccount = new AccountModel(
            accessToken,
            response.data.id,
            response.data.full_name,
            response.data.username,
            response.data.profile_picture
          );
          if (authArray === 'from') {
            settings.fromAccounts.push(newAccount);
          } else {
            settings.toAccounts.push(newAccount);
          }
          this.state.save(settings);
          this.state.error = false;
          if (this.state.settings.valid()) {
            this.state.goTo('process');
          } else {
            this.state.goTo('configure');
          }
        },
        (error) => {
          this.state.error = true;
          this.state.errorMessage = 'There was an error authorizing the requested account. Please try again.';
          this.state.goTo('configure');
        },
        () => {
          this.cookie.remove('authArray');
        }
      );
      
    }
  }

}