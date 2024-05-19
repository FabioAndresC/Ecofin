import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcofinAppComponent } from './ecofin-app.component';

describe('EcofinAppComponent', () => {
  let component: EcofinAppComponent;
  let fixture: ComponentFixture<EcofinAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcofinAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcofinAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
