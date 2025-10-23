import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// ✅ Export Toast interface
export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();

  // ✅ Observable for components to subscribe
  toastState = this.toastSubject.asObservable();

  // Show a toast
  show(message: string, type: 'success' | 'error' = 'success') {
    this.toastSubject.next({ message, type });
  }
}
