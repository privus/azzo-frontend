import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { menuReinitialization } from 'src/app/_metronic/kt/kt-helpers';
import { AccountService } from '../../../../../modules/account/services/account.service';
import { Usuario } from '../../../../../modules/account/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';
  user: Usuario | null = null;

  constructor(private accountService: AccountService) {}

  ngAfterViewInit(): void {
    menuReinitialization();
  }

  ngOnInit(): void {
    this.accountService.getUserInfo().subscribe((user) => {
      this.user = user;
      console.log('USER DO NAVBAR ======>', this.user);
    });
  }
}
