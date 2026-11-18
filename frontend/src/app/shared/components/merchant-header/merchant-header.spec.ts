import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantHeader } from './merchant-header';

describe('MerchantHeader', () => {
  let component: MerchantHeader;
  let fixture: ComponentFixture<MerchantHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
