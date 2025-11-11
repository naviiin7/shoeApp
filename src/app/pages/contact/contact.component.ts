import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  submitted = false;

  submit() {
    // TODO: wire to a real API later
    this.submitted = true;
    console.log('Contact form submitted', { name: this.name, email: this.email, message: this.message });
    setTimeout(() => {
      this.name = this.email = this.message = '';
    }, 600);
  }
}
