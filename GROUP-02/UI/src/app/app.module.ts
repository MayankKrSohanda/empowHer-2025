// 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CardComponent } from './card/card.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { OrderComponent } from './order/order.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AppRoutingModule } from './app-routing.module';

// Admin Components
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAddProductComponent } from './admin/admin-add-product/admin-add-product.component';
import { AdminAllProductsComponent } from './admin/admin-all-products/admin-all-products.component';

// Front Page
import { FrontPageComponent } from './front-page/front-page.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { AdminUpdateProductComponent } from './admin/admin-update-product/admin-update-product.component';
import { SignupComponent } from './signup/signup.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';


const routes: Routes = [
  { path: '', component: FrontPageComponent }, // Landing page
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },

  // Admin routes
  { path: 'admin/home', component: AdminHomeComponent },
  { path: 'admin/products', component: AdminAllProductsComponent },
  { path: 'admin/products/add', component: AdminAddProductComponent },
   { path: 'admin/orders', component: ManageOrdersComponent }, 
   { path: 'admin/update-product/:id', component: AdminUpdateProductComponent },
 { path: 'admin/login', component: AdminLoginComponent },


  // Redirect unknown paths to front page
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CardComponent,
    ProductDetailComponent,
    OrderComponent,
    CartComponent,
    CheckoutComponent,
    

    // Admin
    AdminHomeComponent,
    AdminAddProductComponent,
    AdminAllProductsComponent,

    // Front Page
    FrontPageComponent,
     ManageOrdersComponent,
     AdminUpdateProductComponent,
     SignupComponent,
     AdminLoginComponent,
   
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule, 
    NgChartsModule,
    RouterModule.forRoot(routes) // <-- Important
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
