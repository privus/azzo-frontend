import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../models/costumer.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.component.html',
  styleUrl: './customers-details.component.scss',
})
export class CustomersDetailsComponent implements OnInit {
  customerForm: FormGroup;
  customer: Cliente | null = null;
  customerId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    this.customerService.getCustomerByCode(this.customerId).subscribe((customer) => {
      this.customer = customer;
      console.log('CLIENTE', customer);
      this.patchFormWithCustomer(customer);
    });
  }

  private initializeForm(): void {
    this.customerForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      nome_empresa: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      telefone: [{ value: '', disabled: true }],
      endereco: [{ value: '', disabled: true }],
      cidade: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      cep: [{ value: '', disabled: true }],
      doc_type: [{ value: '', disabled: true }],
      doc_number: [{ value: '', disabled: true }],
      ie: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      num_endereco: [{ value: '', disabled: true }],
      complemento: [{ value: '', disabled: true }],
      categoria: [{ value: '', disabled: true }],
    });
  }

  private patchFormWithCustomer(customer: Cliente): void {
    this.customerForm.patchValue({
      id: customer.cliente_id,
      nome: customer.nome,
      nome_empresa: customer.nome_empresa || customer.nome,
      email: customer.email,
      telefone: customer.celular || customer.telefone_comercial,
      endereco: customer.endereco,
      cidade: customer.cidade.nome,
      estado: customer.cidade.estado.nome,
      cep: customer.cep,
      doc_number: customer.numero_doc,
      status: customer.status,
      ie: customer.ie,
      doc_type: customer.tipo_doc,
      bairro: customer.bairro,
      num_endereco: customer.num_endereco,
      complemento: customer.complemento,
      categoria: customer.categoria,
    });
  }
}
