// src/app/features/orders/orders.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { OrdersRoutingModule } from './orders-routing.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MyOrdersComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule {}
