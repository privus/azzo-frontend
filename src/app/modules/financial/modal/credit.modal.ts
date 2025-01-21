import { Cliente } from './../../commerce/models/costumer.model';
import { Pedido, StatusPagamento } from '../../commerce/models';

export interface Credito {
  parcela_id: number;
  numero: number;
  valor: string;
  juros: string | null;
  data_criacao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status_pagamento: StatusPagamento;
  venda: Pedido;
  cliente: Cliente;
}
