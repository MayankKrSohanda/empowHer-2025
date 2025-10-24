import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category, ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('selectFile') selectFile!: ElementRef<HTMLInputElement>;
  @ViewChild('productForm') productForm!: NgForm;

  categories: Category[] = [];
  selectedCategory: number | 'other' = 0;
  newCategoryName = '';
  toastMsg = '';
  toastType: 'success' | 'danger' | 'info' = 'info';

  newProduct: Product = {
    title: '',
    description: '',
    quantity: 0,
    price: 0,
    categoryId: 0,
    isActive: true,
    productImg: [],
  };

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    // subscribe to categories BehaviorSubject so dropdown is reactive
    this.productService.categories$.subscribe((cats) => {
      this.categories = cats;
      if (!this.selectedCategory && cats.length) {
        this.selectedCategory = cats[0].categoryId;
      }
    });

    // make sure categories are loaded (fresh)
    this.productService.loadCategories();
  }

  onFileSelected(event: any) {
    if (!event.target.files) return;
    if (!this.newProduct.files) this.newProduct.files = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];
      this.newProduct.files.push(file);

      if (!this.newProduct.productImg) this.newProduct.productImg = [];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      ) as string;
      this.newProduct.productImg.push({ id: 0, url });
    }
  }

  private prepareFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append(
      'product',
      new Blob([JSON.stringify(product)], { type: 'application/json' })
    );
    product.files?.forEach((file) => {
      formData.append('imgFile', file, file.name);
    });
    return formData;
  }

  addProduct(): void {
    if (
      !this.newProduct.title ||
      !this.newProduct.price ||
      !this.selectedCategory
    ) {
      this.showToast('Please fill all required fields.', 'info');
      return;
    }

    if (this.selectedCategory === 'other') {
      if (!this.newCategoryName?.trim()) {
        this.showToast('Enter new category name', 'info');
        return;
      }
      this.productService.addCategory(this.newCategoryName.trim()).subscribe({
        next: (newCat) => this.submitProduct(newCat.categoryId),
        error: () => this.showToast('Failed to create category', 'danger'),
      });
    } else {
      this.submitProduct(this.selectedCategory as number);
    }
  }

  private submitProduct(categoryId: number) {
    this.newProduct.categoryId = categoryId;
    const fd = this.prepareFormData(this.newProduct);

    this.productService.addProduct(fd).subscribe({
      next: (res) => {
        console.log(res);
        // ensure fresh products from backend (in case backend logic changes listing)
        this.productService.loadProducts();

        this.showToast('Product added successfully', 'success');

        // reset and navigate to admin products after a short delay
        this.resetForm();
        setTimeout(() => this.router.navigate(['/admin/products']), 800);
      },
      error: () => this.showToast('Failed to add product.', 'danger'),
    });
  }
  goToAdminHome(){
    this.router.navigate(['/admin/products']);
  }

  resetForm(): void {
    this.newProduct = {
      categoryId: this.categories[0]?.categoryId ?? 0,
      title: '',
      description: '',
      price: 0,
      quantity: 0,
      isActive: true,
      productImg: [],
      files: [],
    };
    this.newCategoryName = '';
    if (this.selectFile?.nativeElement)
      this.selectFile.nativeElement.value = '';
    this.productForm?.resetForm({
      isActive: true,
      categoryId: this.selectedCategory,
    });
  }

  showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMsg = msg;
    this.toastType = type;
    const el = document.getElementById('liveToast');
    if (el) {
      const bs = new bootstrap.Toast(el);
      bs.show();
    }
  }
}
