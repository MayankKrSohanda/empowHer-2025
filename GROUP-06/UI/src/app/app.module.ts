import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main/main.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AdminAddProductComponent } from './admin/admin-add-product/admin-add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MainComponent,
    OrderHistoryComponent
       //AdminAddProductComponent// ✅ only shared/global components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
