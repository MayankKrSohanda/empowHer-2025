import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { EditProductComponent } from './admin/edit-product/edit-product.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },    // login route
  { path: 'home', component: HomeComponent }  ,
  {path: '', redirectTo: '/login', pathMatch:'full'} ,
  {path: 'product/:id', component: ProductDetailComponent} ,
  {path:'cart',component:CartComponent},
  {path:'admin',component:AdminComponent},
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {path:'order-details', component:OrderDetailsComponent},
  {path: 'admin/products/edit-product/:id', component: EditProductComponent },
  {path: 'chat-bot', component:ChatBotComponent},
  {path: 'my-orders', component: MyOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
