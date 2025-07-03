import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsPersonComponent } from './order-details-person.component';

describe('OrderDetailsPersonComponent', () => {
  let component: OrderDetailsPersonComponent;
  let fixture: ComponentFixture<OrderDetailsPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
