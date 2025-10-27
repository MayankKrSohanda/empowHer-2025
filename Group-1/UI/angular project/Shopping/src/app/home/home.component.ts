import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AddToCartRequest } from '../model/addToCartRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  allProducts: Product[] = [];

  filteredProducts:Product[]=[];
  
  selectedCategory: number | null = null;
  minPrice: number | null=null;
  maxPrice: number | null=null;
  searchTitle:string="";

  constructor(private productService: ProductService, private router:Router, private cartService: CartService, private route:ActivatedRoute){}

  ngOnInit(): void{
    this.loadAllProducts();

    this.productService.searchQuery$.subscribe(query =>{
      if(!query){
        this.filteredProducts=[...this.allProducts];
      }else{
        this.productService.getProductByTitle(query).subscribe({
          next: (products)=>this.filteredProducts=products,
          error:(err)=>console.error('Error searching',err)
        });
      }
    });

    this.route.fragment.subscribe(fragment => {
    if (fragment) {
      console.log('Fragment received:', fragment); 
      const element = document.getElementById(fragment);
      if (element) {
        console.log('Element found, attempting to scroll:', element); 
        element.scrollIntoView({ behavior: 'smooth' });
        this.resetSearch;
      } else {
        console.warn('Element not found for fragment:', fragment); 
      }
    }
  });
  }

 
  loadAllProducts(){
    this.productService.getAllProducts().subscribe({
      next: (products)=>{
        this.allProducts=products;
        this.filteredProducts=[...this.allProducts];
      },
      error:(err)=>console.error('Error fetching products',err)
    });
  }
  filterProducts(){
   this.productService.getFilteredProducts(this.selectedCategory!,this.minPrice!,this.maxPrice!).subscribe({
    next:(products)=>{
      console.log('Products from API:', products);
      this.filteredProducts=products;
    },
    error:(err)=>console.error('Error filtering products',err)
   });
  }


  resetSearch() {
    this.searchTitle = ""; 
    this.filteredProducts = [...this.allProducts]; 
  }


  navigateToProduct(productId:number):void{
    this.router.navigate(['/product',productId]);
  }
 
}