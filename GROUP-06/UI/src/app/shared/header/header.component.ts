import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  filtersForm!: FormGroup;

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home Appliances' }
  ];

  @Output() filtersChanged = new EventEmitter<any>();
 

  constructor(private fb: FormBuilder, private router: Router,public authService: AuthService,public orderService: OrderService) {}

  ngOnInit(): void {
  this.filtersForm = this.fb.group({
    searchText: [''],
    selectedCategory: [''], // This is the dropdown
    maxPrice: [100000],
    sortBy: ['']
  });

  // Emit on value changes
  this.filtersForm.valueChanges.subscribe(values => this.emitFilters(values));
}

private emitFilters(values: any) {
  // Convert selectedCategory to number and emit as categoryId
  const categoryId = values.selectedCategory ? Number(values.selectedCategory) : undefined;

  this.filtersChanged.emit({
    searchText: values.searchText,
    categoryId: categoryId,  // ✅ important
    maxPrice: values.maxPrice,
    sortBy: values.sortBy
  });

  console.log('Header emitted filters:', {
    searchText: values.searchText,
    categoryId,
    maxPrice: values.maxPrice,
    sortBy: values.sortBy
  });
}

  goToCart() {
    this.router.navigate(['/customer/cart']);
  }
  logout(){
this.authService.logout();
  }

  orderHistory(){
    this.router.navigate(['/order-history/'])
   this.orderService.getUserOrders();
  }
}
