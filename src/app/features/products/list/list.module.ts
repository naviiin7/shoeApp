// src/app/features/products/list/list.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,    // <-- required for [(ngModel)]
    RouterModule,   // <-- required for [routerLink]
    SharedModule
  ],
  exports: [
    ProductListComponent,
    FormsModule,
    RouterModule
  ]
})
export class ProductListModule {}
