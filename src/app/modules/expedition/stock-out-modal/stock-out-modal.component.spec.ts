import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutModalComponent } from './stock-out-modal.component';

describe('StockOutModalComponent', () => {
  let component: StockOutModalComponent;
  let fixture: ComponentFixture<StockOutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockOutModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockOutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
