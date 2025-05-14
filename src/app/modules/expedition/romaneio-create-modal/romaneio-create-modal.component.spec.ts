import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RomaneioCreateModalComponent } from './romaneio-create-modal.component';

describe('RomaneioCreateModalComponent', () => {
  let component: RomaneioCreateModalComponent;
  let fixture: ComponentFixture<RomaneioCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RomaneioCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RomaneioCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
