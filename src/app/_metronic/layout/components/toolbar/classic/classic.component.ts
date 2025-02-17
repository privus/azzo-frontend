import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DebtCreateModalComponent } from '../../../../../modules/financial/debt-create-modal/debt-create-modal.component';
import { CreditCreateModalComponent } from '../../../../../modules/financial/credit-create-modal/credit-create-modal.component';

@Component({
  selector: 'app-classic',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.scss'],
})
export class ClassicComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  currentRoute: string = '';
  private modalReference: NgbModalRef;

  appToolbarPrimaryButton: boolean;
  appToolbarPrimaryButtonLabel: string = '';
  appToolbarPrimaryButtonUrl: string = '';
  appToolbarPrimaryButtonModal: string = '';
  appToolbarSecondaryButton: boolean;
  appToolbarFixedDesktop: boolean;
  appToolbarSecondaryButtonLabel: string = '';
  appToolbarSecondaryButtonUrl: string = '';
  appToolbarSecondaryButtonModal: string = '';
  appToolbarFilterButton: boolean;
  appToolbarDaterangepickerButton: boolean;
  secondaryButtonClass: string = '';
  filterButtonClass: string = '';
  daterangepickerButtonClass: string = '';

  constructor(
    private layout: LayoutService,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.updateProps();
    const subscr = this.layout.layoutConfigSubject.asObservable().subscribe(() => {
      this.updateProps();
    });
    this.unsubscribe.push(subscr);
  }

  updateProps() {
    this.appToolbarPrimaryButton = this.layout.getProp('app.toolbar.primaryButton') as boolean;
    this.appToolbarPrimaryButtonLabel = this.layout.getProp('app.toolbar.primaryButtonLabel') as string;
    this.appToolbarPrimaryButtonUrl = this.layout.getProp('app.toolbar.primaryButtonUrl') as string;
    this.appToolbarPrimaryButtonModal = this.layout.getProp('app.toolbar.primaryButtonModal') as string;
    this.appToolbarSecondaryButton = this.layout.getProp('app.toolbar.secondaryButton') as boolean;
    this.secondaryButtonClass = this.appToolbarFixedDesktop ? 'btn-light' : 'bg-body btn-color-gray-700 btn-active-color-primary';
    this.appToolbarFixedDesktop = this.layout.getProp('appToolbarFixedDesktop') as boolean;
    this.appToolbarSecondaryButtonLabel = this.layout.getProp('appToolbarSecondaryButtonLabel') as string;
    this.appToolbarSecondaryButtonUrl = this.layout.getProp('appToolbarSecondaryButtonUrl') as string;
    this.appToolbarSecondaryButtonModal = this.layout.getProp('appToolbarSecondaryButtonModal') as string;
    this.appToolbarFilterButton = this.layout.getProp('appToolbarFilterButton') as boolean;
    this.appToolbarDaterangepickerButton = this.layout.getProp('appToolbarDaterangepickerButton') as boolean;

    this.filterButtonClass = this.appToolbarFixedDesktop ? 'btn-light' : 'bg-body btn-color-gray-600 btn-active-color-primary';
    this.daterangepickerButtonClass = this.appToolbarFixedDesktop ? 'btn-light' : 'bg-body btn-color-gray-700 btn-active-color-primary';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  openDebtModal() {
    this.modalReference = this.modalService.open(DebtCreateModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  openCreditModal() {
    this.modalReference = this.modalService.open(CreditCreateModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  getCurrentRouteSegment(): void {
    // Captura o primeiro segmento da rota
    const urlSegments = this.router.url.split('/');
    this.currentRoute = urlSegments.length > 1 ? urlSegments[1] : '';
  }

  shouldDisplayButtons(): boolean {
    return this.currentRoute !== 'commerce';
  }

  getSecondaryButtonLink(): string {
    this.getCurrentRouteSegment();

    switch (this.currentRoute) {
      case 'apps':
        return 'apps/users';
      case 'financial/debts':
        return '/financial/credts';
      case 'financial/debts':
        return '/financial/debts';
      default:
        return '';
    }
  }

  createButton(): any {
    const fullPath = this.router.url;
    if (fullPath.includes('financial/debts')) {
      this.openDebtModal();
    }
    if (this.currentRoute == 'apps') {
      this.router.navigate(['/users/new-account']);
    }
    if (fullPath.includes('financial/credits')) {
      this.openCreditModal();
    }
  }

  isDisabled(): boolean {
    return this.currentRoute === 'commerce';
  }
}
