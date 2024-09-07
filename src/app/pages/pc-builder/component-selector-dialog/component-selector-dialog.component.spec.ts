import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSelectorDialogComponent } from './component-selector-dialog.component';

describe('ComponentSelectorDialogComponent', () => {
  let component: ComponentSelectorDialogComponent;
  let fixture: ComponentFixture<ComponentSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSelectorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComponentSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
