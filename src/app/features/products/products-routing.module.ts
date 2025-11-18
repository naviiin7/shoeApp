// src/app/features/products/products-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Correct component paths (point to the actual component files)
import { ProductListComponent } from './list/product-list/product-list.component';
import { ProductDetailComponent } from './detail/product-detail/product-detail.component';

const routes: Routes = [
  // /shop  => list page (if mounted under /shop in app-routing)
  { path: '', component: ProductListComponent },
  // /shop/:id => detail
  { path: ':id', component: ProductDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
