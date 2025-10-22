import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';

// shared.module.ts
@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [HeaderComponent, ReactiveFormsModule]
})
export class SharedModule {}

// ...existing code...