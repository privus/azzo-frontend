import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProjectionComponent } from './stock-projection.component';

describe('StockProjectionComponent', () => {
  let component: StockProjectionComponent;
  let fixture: ComponentFixture<StockProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProjectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
