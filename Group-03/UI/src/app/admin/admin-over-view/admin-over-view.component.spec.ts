import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverViewComponent } from './admin-over-view.component';

describe('AdminOverViewComponent', () => {
  let component: AdminOverViewComponent;
  let fixture: ComponentFixture<AdminOverViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOverViewComponent]
    });
    fixture = TestBed.createComponent(AdminOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
