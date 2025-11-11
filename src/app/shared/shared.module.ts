// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// components (adjust paths if yours differ)
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MiniCartComponent } from './components/mini-cart/mini-cart.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MiniCartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MiniCartComponent,
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule {}
