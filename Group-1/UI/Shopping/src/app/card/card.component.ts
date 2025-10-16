import { Component,Input,Output, EventEmitter } from '@angular/core';
import { Product } from '../model/product';
import { CartService } from '../services/cart.service';
import { AddToCartRequest } from '../model/addToCartRequest';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() product!:Product;
  @Output() viewDetailsEvent=new EventEmitter<number>();
  alertMessage: string|null=null;
  alertType:'success'|'danger'='success';

  private userId: number=1;

  constructor(private cartService: CartService){}

  onAddToCart(event:Event):void{
    event.stopPropagation();
    
    const request:AddToCartRequest={
      userId:this.userId,
      productId:this.product.id!,
      quantity:1
    };
    this.cartService.addToCart(request).subscribe({
      next: (response) => {  
        this.alertType='success';
        this.alertMessage="Item added to cart successfully";
        setTimeout(()=>this.alertMessage=null,3000);
      },
      error: (err) => {
        this.alertType='danger';
        this.alertMessage="Error adding to cart";
        setTimeout(()=>this.alertMessage=null,3000);
      }
    });

  }


  viewDetails(): void{
    this.viewDetailsEvent.emit(this.product.id)
  }
}
