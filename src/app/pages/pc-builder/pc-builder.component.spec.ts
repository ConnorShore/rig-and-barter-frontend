import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcBuilderComponent } from './pc-builder.component';

describe('PcBuilderComponent', () => {
  let component: PcBuilderComponent;
  let fixture: ComponentFixture<PcBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
