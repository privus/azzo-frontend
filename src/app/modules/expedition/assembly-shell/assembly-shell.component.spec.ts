import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyShellComponent } from './assembly-shell.component';

describe('AssemblyShellComponentComponent', () => {
  let component: AssemblyShellComponentComponent;
  let fixture: ComponentFixture<AssemblyShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
