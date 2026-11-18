import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-merchant-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './merchant-sidebar.html',
  styleUrl: './merchant-sidebar.css',
})
export class MerchantSidebar {}