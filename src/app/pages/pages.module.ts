// src/app/pages/pages.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module'; 
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
// import any other page components you have (AboutComponent, etc.)

@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    // add other page components here
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,  // ✅ important for [(ngModel)]
    RouterModule,
    
  ],
  exports: [
    HomeComponent,
    ContactComponent,
  ],
})
export class PagesModule {}
