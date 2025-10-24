import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, ProductService } from 'src/app/services/product.service';

declare global {
  interface Window {
    bootstrap: any;
  }
}

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  editingCategory: Category | null = null;
  loading = false;
  toastMessage = '';
  showingToast = false;
  categoryToDelete: Category | null = null;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  addCategory() {
    if (this.categoryForm.invalid) return;

    const name = this.categoryForm.value.categoryName;

    if (this.editingCategory) {
      this.showToast('Category update not implemented');
      return;
    }

    this.productService.addCategory(name).subscribe({
      next: (cat) => {
        this.showToast(`Category "${cat.categoryName}" added`);
        this.categoryForm.reset();
        this.loadCategories();
      },
      error: (err) => console.error(err),
    });
  }
  confirmDelete(cat: Category) {
    this.categoryToDelete = cat;
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  deleteCategory(cat: Category) {
    if (!this.categoryToDelete) return;

    this.productService.deleteCategory(cat.categoryId).subscribe({
      next: () => {
        this.showToast(
          `Category "${this.categoryToDelete!.categoryName}" deleted`
        );
        this.loadCategories();
        this.categoryToDelete = null;
        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = window.bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => console.error(err),
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.showingToast = true;
    setTimeout(() => (this.showingToast = false), 3000);
  }
}
