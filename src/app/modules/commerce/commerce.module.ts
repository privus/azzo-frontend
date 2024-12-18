import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CommerceRoutingModule } from './commerce-routing.module';
import { RouterModule } from '@angular/router';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';

@NgModule({
  declarations: [ProductsListingComponent, ProductDetailsComponent, CustomerListingComponent],
  imports: [SharedModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, CommerceRoutingModule, SweetAlert2Module.forChild()],
})
export class CommerceModule {}
