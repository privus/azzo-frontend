import { StatusPagamento } from './../../commerce/models/order.model';

export interface Debt {
  debito_id: number;
  numero_parcelas: number;
  data_criacao: string;
  data_pagamento: string | null;
  descricao: string;
  valor_parcela: string;
  juros: string | null;
  valor_total: string;
  metodo_pagamento: string;
  datas_vencimento: string[][] | null;
  parcela_debito: ParcelaDebito[];
  status_pagamento: StatusPagamento;
  departamento: Departamento;
  categoria: Categoria
}

export interface ParcelaDebito {
  parcela_id: number;
  numero: number;
  valor: string;
  juros: string;
  data_criacao: string;
  data_vencimento: string;
  data_pagamento: string | null;
}

export interface Departamento {
  departamento_id: number;
  nome: string;
}

export interface Categoria {
  categoria_id: number;
  nome: string;
}
