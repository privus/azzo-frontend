import { Cliente } from './../../commerce/models/';
import { Pedido, StatusPagamento } from '../../commerce/models';

export interface Credit {
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
