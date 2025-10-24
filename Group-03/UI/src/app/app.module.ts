import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CardComponent } from './card/card.component';
import { SearchComponent } from './home/search/search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { AppRoutingModule } from './app-routing.module';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AddProductComponent } from './admin/add-product/add-product.component';

import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { SignupComponent } from './sign-up/sign-up.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminOverViewComponent } from './admin/admin-over-view/admin-over-view.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CardComponent,
    SearchComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderSummaryComponent,
    NavbarComponent,
    AdminHomeComponent,
    AddProductComponent,
    EditProductComponent,
    SignupComponent,
    OrderReviewComponent,
    AdminDashboardComponent,
    AdminLayoutComponent,
    AdminOverViewComponent,
    AdminOrdersComponent,
    AdminCategoriesComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
