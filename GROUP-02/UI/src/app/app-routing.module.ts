import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// User Components
import { FrontPageComponent } from './front-page/front-page.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { CheckoutComponent } from './checkout/checkout.component';

// Admin Components
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAllProductsComponent } from './admin/admin-all-products/admin-all-products.component';
import { AdminAddProductComponent } from './admin/admin-add-product/admin-add-product.component';
import { SignupComponent } from './signup/signup.component';
import { AdminUpdateProductComponent } from './admin/admin-update-product/admin-update-product.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';


const routes: Routes = [
  // Landing page
  { path: '', component: FrontPageComponent },

  // User routes
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderComponent },
  {path:'signup',component:SignupComponent},
  { path: 'checkout', component: CheckoutComponent },


  // Admin routes

  { path: 'admin/home', component: AdminHomeComponent },
  { path: 'admin/products', component: AdminAllProductsComponent },
  { path: 'admin/add-product', component: AdminAddProductComponent },
  { path: 'admin/add-product/:id', component: AdminAddProductComponent },   //for edit prodct
  { path: 'admin/update-product/:id', component: AdminUpdateProductComponent },
  { path: 'admin/orders', component: ManageOrdersComponent },
   { path: 'admin/login', component: AdminLoginComponent }, 

  

  // Wildcard route: redirect unknown paths to landing page
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
