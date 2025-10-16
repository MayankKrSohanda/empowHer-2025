
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/model/product';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent  {
  productForm!: FormGroup;

  selectedFile:File|null=null;
  previewUrl:string|ArrayBuffer|null=null;
  alertType:'success'|'danger'='success';
  alertMessage:string|null=null;

categories = [
  { id: 1, name: 'Fashion' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Jwelleries' },
  { id: 4, name: 'Sports' }
];

  productId?: number;

  constructor(private fb: FormBuilder, private productService: ProductService) {}
 

  ngOnInit(): void {
    this.productForm = this.fb.group({
  title: ['', Validators.required],
  description: ['', Validators.required],
  price: [0, [Validators.required, Validators.min(1)]],
  availableQuantity: [0, [Validators.required, Validators.min(1)]],
  categoryId: [null, Validators.required],
  isActive: [true]   
});

  }

  onFileSelected(event:Event):void{
    const input=event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      this.selectedFile=input.files[0];
      const reader=new FileReader();
      reader.onload= e=>this.previewUrl=reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const product = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        availableQuantity: formValue.availableQuantity,
        isActive:formValue.isActive,
        category: { id: formValue.categoryId } 
      };

      const formData=new FormData();
      formData.append(
        'product',
        new Blob([JSON.stringify(product)],{type:'application/json'})
      );

      if(this.selectedFile){
          formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }

      this.productService.addProduct(formData).subscribe({
        next: res => {
          console.log('Product added:', res);
          this.alertType='success';
          this.alertMessage="Product added successfully";
          setTimeout(()=>{
            this.alertMessage=null,
            this.productForm.reset();
          this.selectedFile=null;
          this.previewUrl=null;
          },3000);
          
        },
        error: (err: any) => {
          this.alertType='danger';
          this.alertMessage="Error adding product";
          console.error('Error adding product:', err);
          setTimeout(()=>this.alertMessage=null,3000);
      
        }
        
      });
    }else{
      this.alertType='danger';
          this.alertMessage="Fill form & select image";
          setTimeout(()=>this.alertMessage=null,3000);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

}

