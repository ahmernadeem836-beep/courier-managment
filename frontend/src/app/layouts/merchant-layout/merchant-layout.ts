import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MerchantSidebar } from '../../shared/components/merchant-sidebar/merchant-sidebar';
import { MerchantHeader } from '../../shared/components/merchant-header/merchant-header';

@Component({
  selector: 'app-merchant-layout',
  imports: [RouterOutlet, MerchantSidebar, MerchantHeader],
  templateUrl: './merchant-layout.html',
  styleUrl: './merchant-layout.css',
})
export class MerchantLayout {}