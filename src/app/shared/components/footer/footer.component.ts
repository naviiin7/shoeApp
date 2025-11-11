import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  year = new Date().getFullYear();
  newsletterEmail = '';

  subscribe(event: Event) {
    event.preventDefault();
    // TODO: wire to real newsletter service
    console.log('Subscribe:', this.newsletterEmail);
    // simple UX: clear input after submit
    this.newsletterEmail = '';
    // could show success toast here
  }
}
