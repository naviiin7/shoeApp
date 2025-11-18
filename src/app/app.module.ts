import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';

import { ProductsModule } from './features/products/products.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

    SharedModule,
    MainLayoutModule,

    ProductsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
