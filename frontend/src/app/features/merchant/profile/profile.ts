
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchant-profile',
  imports: [FormsModule],
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

  exampleTrackingId = 'AL-7K4P92QX';

  isEditing = false;
  saveMessage = '';

  copyText(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      this.saveMessage = 'Copied successfully!';

      setTimeout(() => {
        this.saveMessage = '';
      }, 2500);
    }).catch(() => {
      this.saveMessage = 'Unable to copy. Please copy manually.';
    });
  }

  editProfile(): void {
    this.isEditing = true;
    this.saveMessage = '';
  }

  saveProfile(): void {
    this.isEditing = false;
    this.saveMessage = 'Profile updated successfully!';
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

}
