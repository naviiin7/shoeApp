import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { ShippingComponent } from './shipping/shipping.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ShippingComponent,
    PaymentComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CheckoutRoutingModule,
    RouterModule
  ]
})
export class CheckoutModule {}
