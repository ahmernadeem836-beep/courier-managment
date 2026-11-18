import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantLayout } from './merchant-layout';

describe('MerchantLayout', () => {
  let component: MerchantLayout;
  let fixture: ComponentFixture<MerchantLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
