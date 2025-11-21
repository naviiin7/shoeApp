// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';

// NOTE: ProductsModule removed from eager imports (it is lazy-loaded via AppRoutingModule)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MainLayoutModule
    // DON'T import ProductsModule here when you lazy-load it elsewhere
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
