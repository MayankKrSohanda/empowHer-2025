// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminAddProductComponent } from './admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './admin-edit-product/admin-edit-product.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' }, // default inside dashboard
      { path: 'products', component: AdminProductsComponent },
      { path: 'add-product', component: AdminAddProductComponent },
      { path: 'edit-product/:id', component: AdminEditProductComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
