import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantRegister } from './merchant-register';

describe('MerchantRegister', () => {
  let component: MerchantRegister;
  let fixture: ComponentFixture<MerchantRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
