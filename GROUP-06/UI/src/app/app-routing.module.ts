import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,   // homepage (MainComponent)
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: 'main',
    component: MainComponent,   // optional explicit route
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,   // optional explicit route
  },
  {
    path: '**',
    redirectTo: 'auth/login',   // wildcard → login
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}































// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { MainComponent } from './main/main.component';

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'auth/login',
//     pathMatch: 'full',
//   },
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./auth/auth.module').then((m) => m.AuthModule),
//   },
//   {
//     path: 'admin',
//     loadChildren: () =>
//       import('./admin/admin.module').then((m) => m.AdminModule),
//   },
//   {
//     path: 'customer',
//     loadChildren: () =>
//       import('./customer/customer.module').then((m) => m.CustomerModule),
//   },
//   {
//     path: '**',
//     redirectTo: 'auth/login', // wildcard always goes to login
//   },
//   {
//    path: '', component: MainComponent
//   },
//   { path: 'main', component: MainComponent }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
