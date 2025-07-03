import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  role: string = '';
  userCompanyId: number = 0;

  constructor(private localStorage: LocalStorageService) {}
  ngOnInit() {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.role = storageInfo ? JSON.parse(storageInfo).cargo.nome : '';
    this.userCompanyId = storageInfo ? JSON.parse(storageInfo).companyId : 0;
  }

  isRole(...roles: string[]): boolean {
    return roles.includes(this.role);
  }

  isRoleOrCompany(role: string, companyId: number): boolean {
    return this.role === role || this.userCompanyId === companyId;
  }
}
