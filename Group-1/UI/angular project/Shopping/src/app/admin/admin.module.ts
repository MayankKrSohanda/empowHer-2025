import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EditProductComponent } from './edit-product/edit-product.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    EditProductComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AdminRoutingModule,
    FormsModule
  ],
  exports: [
    ProductListComponent,
    ProductFormComponent
  ]
})

export class AdminModule { }
