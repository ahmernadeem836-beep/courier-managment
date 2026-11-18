import { Component } from '@angular/core';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  merchant = {
    businessName: 'Ali Electronics',
    merchantCode: 'AL',
    ownerName: 'Ali Ahmed',
    email: 'ali@example.com',
    phone: '03001234567',
    businessAddress: 'Main Boulevard, Lahore',
    city: 'Lahore',
    accountStatus: 'Active',
    registrationDate: '18 November 2026',
  };

}