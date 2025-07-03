import { Cliente, PCliente, POrder } from './../../commerce/models/';
import { Order, StatusPagamento } from '../../commerce/models';
import { Categoria, Conta } from './debt.modal';

export interface Credit {
  parcela_id: number;
  nome: string | null;
  numero: number | null;
  valor: string;
  juros: string | null;
  data_criacao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status_pagamento: StatusPagamento;
  data_competencia: string;
  venda: Order | null;
  cliente: Cliente | null;
  descricao: string | null;
  categoria: Categoria | null;
  categoria_nome: string | null;
  categoria_id: number | null;
  conta: string | null;
  criado_por: string;
  atualizado_por: string;
}

export interface PCredit {
  parcela_id: number;
  nome: string | null;
  numero: number | null;
  valor: string;
  juros: string | null;
  data_criacao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status_pagamento: StatusPagamento;
  data_competencia: string;
  venda: POrder | null;
  cliente: PCliente | null;
  descricao: string | null;
  categoria: Categoria | null;
  categoria_nome: string | null;
  categoria_id: number | null;
  account: Conta;
  criado_por: string;
  atualizado_por: string;
}

export interface NewCredit {
  nome: string;
  descricao: string;
  categoria_nome: string;
  categoria_id: number;
  valor: number;
  data_vencimento: string;
  data_competencia: string;
  data_pagamento: string | null;
  conta: string;
  atualizado_por: string;
}

export interface PGenerateCredit {
  valor: number;
  numero: number;
  data_vencimento: string;
  data_competencia: string;
  data_pagamento: string | null;
}
