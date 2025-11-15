// src/app/features/products/products.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';

// Import the list sub-module instead of redeclaring the list component here
import { ListModule } from './list/list.module';

@NgModule({
  declarations: [
    // keep higher-level or shared product components here (if any)
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ListModule
  ],
  exports: [
    ListModule
  ]
})
export class ProductsModule {}
