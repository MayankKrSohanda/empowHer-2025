import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../model/product';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Category, ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;

  editedProduct: Product = {
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: 0,
    isActive: true,
    productImg: [],
  };

  selectedFiles: File[] = []; // newly added images
  removedImageIds: number[] = []; // IDs of images removed
  categories: Category[] = [];
  toastMsg = '';
  toastType: 'success' | 'danger' = 'success';

  constructor(
    private productService: ProductService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load categories first
    this.productService.categories$.subscribe((cats) => {
      this.categories = cats;

      // Load product by id from route
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.productService.getProductById(+id).subscribe((prod) => {
          this.editedProduct = { ...prod };
          this.cdr.detectChanges(); 
          if (this.categories.length) {
            const match = this.categories.find(
              (c) => c.categoryId === this.editedProduct.categoryId
            );
            if (match) {
              this.editedProduct.categoryId = match.categoryId;
            } else if (this.categories.length) {
              this.editedProduct.categoryId = this.categories[0].categoryId;
            }
          }
        });
      }
    });

    this.productService.loadCategories();
  }

  // Preview new selected images
  getFileUrl(file: File) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  // Handle new image selection
  onFileSelected(event: any) {
    if (!event.target.files) return;
    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
  }

  // Remove a newly added image before upload
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // Remove an old image
  removeExistingImage(index: number) {
    const removed = this.editedProduct.productImg.splice(index, 1)[0];
    if (removed.id !== undefined) {
      this.removedImageIds.push(removed.id);
    }
  }

  // Prepare FormData to send to backend
  private prepareFormData(product: Product): FormData {
    const formData = new FormData();
    const payload = { ...product, removedImageIds: this.removedImageIds };
    formData.append(
      'product',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    this.selectedFiles.forEach((file) =>
      formData.append('imgFile', file, file.name)
    );
    return formData;
  }

  // Save updated product
  saveChanges() {
    const fd = this.prepareFormData(this.editedProduct);

    this.productService.updateProduct(this.editedProduct.id!, fd).subscribe({
      next: () => {
        this.productService.loadProducts();
        this.showToast('Product updated successfully!', 'success');

        setTimeout(() => {
          this.router.navigate(['/admin/products']); // redirect after showing alert
        }, 1500);
      },
      error: () => {
        this.showToast('Failed to update product.', 'danger');
      },
    });
  }

  showToast(msg: string, type: 'success' | 'danger') {
    this.toastMsg = msg;
    this.toastType = type;
    const el = document.getElementById('editToast');
    if (el) {
      const bs = new bootstrap.Toast(el);
      bs.show();
    }
  }
 goToAdminHome(){
  this.router.navigate(['/admin/products']);
 }

  // Reset form to original values
  resetForm() {
    this.ngOnInit();
    this.selectedFiles = [];
    this.removedImageIds = [];
    this.editForm?.resetForm(this.editedProduct);
  }
}
