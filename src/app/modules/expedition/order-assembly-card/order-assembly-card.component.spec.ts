import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssemblyCardComponent } from './order-assembly-card.component';

describe('OrderAssemblyCardComponent', () => {
  let component: OrderAssemblyCardComponent;
  let fixture: ComponentFixture<OrderAssemblyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAssemblyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAssemblyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
