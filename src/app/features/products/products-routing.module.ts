import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './list/product-list/product-list.component';
import { ProductDetailComponent } from './detail/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: ProductListComponent, data: { animation: 'ProductList' } },
  { path: ':id', component: ProductDetailComponent, data: { animation: 'ProductDetail' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
