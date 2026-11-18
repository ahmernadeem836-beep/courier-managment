import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantSidebar } from './merchant-sidebar';

describe('MerchantSidebar', () => {
  let component: MerchantSidebar;
  let fixture: ComponentFixture<MerchantSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
