import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { SignupComponent } from './sign-up/sign-up.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminOverViewComponent } from './admin/admin-over-view/admin-over-view.component';

const routes: Routes = [
  // User routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [UserGuard] },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [UserGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [UserGuard] },
  {
    path: 'order-summary',
    component: OrderSummaryComponent,
    canActivate: [UserGuard],
  },
  { path: 'order-review', component: OrderReviewComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },

  // Admin routes using layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'admin-over-view', pathMatch: 'full' },
      { path: 'products', component: AdminHomeComponent },
      { path: 'add-products', component: AddProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'admin-over-view', component: AdminOverViewComponent },
      {
        path: 'admin-orders',
        component: AdminOrdersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'admin-categories',
        component: AdminCategoriesComponent,
        canActivate: [AdminGuard],
      },
    ],
  },

  // Wildcard / fallback
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
