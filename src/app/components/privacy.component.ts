import { Component, OnInit } from '@angular/core';

import { StateService } from '../services/state.service';

@Component({
  selector: 'privacy-component',
  templateUrl: 'privacy.component.html'
})
export class PrivacyComponent implements OnInit {

  constructor(private state: StateService) {}

  public ngOnInit() {
    this.state.loading = false;
  }

}