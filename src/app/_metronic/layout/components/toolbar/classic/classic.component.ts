import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DebtCreateModalComponent } from '../../../../../modules/financial/debt-create-modal/debt-create-modal.component';
import { CreditCreateModalComponent } from '../../../../../modules/financial/credit-create-modal/credit-create-modal.component';
import { RomaneioCreateModalComponent } from '../../../../../modules/expedition/romaneio-create-modal/romaneio-create-modal.component';
import { ImportXmlModalComponent } from '../../../../../modules/expedition/import-xml-modal/import-xml-modal.component';
import { StockOutModalComponent } from '../../../../../modules/expedition/stock-out-modal/stock-out-modal.component';
import { AccountService } from '../../../../../modules/account/services/account.service';
import { GoalsModalComponent } from 'src/app/modules/sellers/goals-modal/goals-modal.component';

@Component({
  selector: 'app-classic',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.scss'],
})
export class ClassicComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  currentRoute: string = '';
  private modalReference: NgbModalRef;
  userEmail: string = '';

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
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.updateProps();
    const subscr = this.layout.layoutConfigSubject.asObservable().subscribe(() => {
      this.updateProps();
    });
    this.unsubscribe.push(subscr);
    this.accountService.getUserInfo().subscribe((user) => {
      this.userEmail = user?.email || '';
      console.log('USER DO NAVBAR ======>', this.userEmail);
    });
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

  openImportXmlModal() {
    this.modalReference = this.modalService.open(ImportXmlModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  openRomaneioModal() {
    document.querySelector('app-layout')?.setAttribute('inert', '');

    this.modalReference = this.modalService.open(RomaneioCreateModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    this.modalReference.result.catch(() => {
      document.querySelector('app-layout')?.removeAttribute('inert');
    });
  }

  openGoalsModal(): void {
    const componentInstance = (window as any)['ng'].getComponent(document.querySelector('app-commission'));
    const vendedores = componentInstance?.comissionSorted;

    if (!vendedores || !Array.isArray(vendedores)) {
      alert('Lista de vendedores não encontrada.');
      return;
    }

    this.modalReference = this.modalService.open(GoalsModalComponent, {
      backdrop: true,
      keyboard: true,
      size: 'md',
      centered: true,
    });

    this.modalReference.componentInstance.vendedores = vendedores;
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
      this.router.navigate(['/apps/users/new-account']);
    }
    if (fullPath.includes('financial/credits')) {
      this.openCreditModal();
    }
    if (fullPath.includes('expedition/romaneio')) {
      this.openRomaneioModal();
    }
    if (fullPath.includes('expedition/stock')) {
      this.openImportXmlModal();
    }
    if (fullPath.includes('sellers/weekly-bonus')) {
      const componentInstance = (window as any)['ng'].getComponent(document.querySelector('app-weekly-bonus'));
      componentInstance?.downloadExcel();
      return;
    }
    if (fullPath.includes('sellers/commissions')) {
      const componentInstance = (window as any)['ng'].getComponent(document.querySelector('app-commission'));
      componentInstance?.downloadExcel();
      return;
    }
    if (fullPath.includes('commerce/customers')) {
      const componentInstance = (window as any)['ng'].getComponent(document.querySelector('app-customer'));
      componentInstance?.exportFilteredCustomers();
      return;
    }
  }

  exportFilteredCustomers(): void {
    const componentInstance = (window as any)['ng'].getComponent(document.querySelector('app-customer'));
    componentInstance?.exportFilteredCustomers();
  }

  isDisabledPrimary(): boolean {
    const fullPath = this.router.url;

    if (fullPath.startsWith('/commerce')) {
      return fullPath !== '/commerce/customers';
    }

    return fullPath.startsWith('/expedition/imported-xml');
  }

  isDisabledSecondary(): boolean {
    const fullPath = this.router.url;

    return fullPath.startsWith('/commerce') || fullPath.startsWith('/expedition/imported-xml');
  }

  getPrimaryButtonLabel(): string {
    const fullPath = this.router.url;

    if (fullPath.includes('expedition/stock')) {
      return 'Importar Xml';
    }
    if (fullPath.includes('sellers/weekly-bonus')) {
      return 'Download Excel';
    }
    if (fullPath.includes('sellers/commissions')) {
      return 'Rel. Comissões';
    }
    if (fullPath.includes('commerce/customers')) {
      return 'Download Excel';
    }
    return 'Criar';
  }

  getSecondaryButtonLabel(): string {
    const fullPath = this.router.url;
    if (fullPath.includes('expedition/stock')) {
      return 'Saída';
    }
    if (fullPath.includes('sellers/commissions')) {
      return 'Metas';
    }
    return 'Listar';
  }

  onSecondaryButtonClick(): void {
    const fullPath = this.router.url;
    if (fullPath.includes('expedition/stock')) {
      this.openStockOutModal();
    } else if (fullPath.includes('sellers/commissions')) {
      this.openGoalsModal();
    } else {
      this.router.navigate([this.getSecondaryButtonLink()]);
    }
  }

  // Nova função para abrir o modal de saída de estoque
  openStockOutModal(): void {
    this.modalReference = this.modalService.open(StockOutModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    this.modalReference.componentInstance.userEmail = this.userEmail;
  }
}
