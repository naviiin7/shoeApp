import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
  
  
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  ]
})
export class ComponentsModule {}
