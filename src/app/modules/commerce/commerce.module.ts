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
import { CustomersDetailsComponent } from './customers-details/customers-details.component';
import { OrderListingComponent } from './order-listing/order-listing.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SellerRankingModalComponent } from './seller-ranking-modal/seller-ranking-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderListingPersonComponent } from './order-listing-person/order-listing-person.component';
import { OrderDetailsPersonComponent } from './order-details-person/order-details-person.component';
import { GenerateInstallmentsModalComponent } from './generate-installments-modal/generate-installments-modal.component';
import { TimeAgoPipe } from '../../../app/shared/pipes/time-ago.pipe';
import { EcommerceComponent } from './e-commerce/e-commerce.component';

@NgModule({
  declarations: [
    ProductsListingComponent,
    ProductDetailsComponent,
    CustomerListingComponent,
    CustomersDetailsComponent,
    OrderListingComponent,
    OrderDetailsComponent,
    SellerRankingModalComponent,
    OrderListingPersonComponent,
    OrderDetailsPersonComponent,
    GenerateInstallmentsModalComponent,
    TimeAgoPipe,
    EcommerceComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommerceRoutingModule,
    SweetAlert2Module.forChild(),
    NgbModule,
  ],
})
export class CommerceModule {}
