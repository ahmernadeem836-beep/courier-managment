import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pickups } from './pickups';

describe('Pickups', () => {
  let component: Pickups;
  let fixture: ComponentFixture<Pickups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pickups],
    }).compileComponents();

    fixture = TestBed.createComponent(Pickups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
