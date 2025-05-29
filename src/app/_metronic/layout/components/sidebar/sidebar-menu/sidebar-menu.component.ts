import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  role: string = '';

  constructor(private localStorage: LocalStorageService) {}
  ngOnInit() {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.role = storageInfo ? JSON.parse(storageInfo).cargo.nome : '';
  }

  isRole(...roles: string[]): boolean {
    return roles.includes(this.role);
  }
}
