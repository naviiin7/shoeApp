import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CartPageComponent } from './cart-page/cart-page.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: CartPageComponent }
];

@NgModule({
  declarations: [CartPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)  // ✅ Important: forChild() not forRoot()
  ]
})
export class CartModule {}
