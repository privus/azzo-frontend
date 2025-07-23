import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssemblyComponent } from './order-assembly.component';

describe('OrderAssemblyComponent', () => {
  let component: OrderAssemblyComponent;
  let fixture: ComponentFixture<OrderAssemblyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAssemblyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
