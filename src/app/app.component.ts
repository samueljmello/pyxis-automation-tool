import { Component } from '@angular/core';
import { 
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
    Router 
} from '@angular/router';
import '../../public/css/styles.css';
@Component({
  selector: 'universal-angular-demo',
  template: `
  <router-outlet>
  <div class="loading-overlay" *ngIf="loading">
    <md-spinner></md-spinner>
  </div>
  </router-outlet>
  `
})
export class AppComponent {

  loading: boolean = true;

  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  };

  public navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

}
