import { StatusPagamento } from './../../commerce/models/order.model';

export interface Debt {
  debito_id: number;
  numero_parcelas: number;
  nome: string;
  data_criacao: string;
  data_competencia: string;
  data_pagamento: string | null;
  descricao: string;
  valor_parcela: string;
  juros: string | null;
  valor_total: string;
  atualizado_por: string | null;
  conta: string;
  empresa: string;
  criado_por: string;
  despesa_grupo: string | null;
  datas_vencimento: string[];
  parcela_debito: ParcelaDebito[];
  status_pagamento: StatusPagamento;
  categoria: Categoria;
  departamento: Departamento;
}

export interface ParcelaDebito {
  parcela_id: number;
  numero: number;
  valor: string;
  juros: string;
  conta: string;
  data_criacao: string;
  data_competencia: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status_pagamento: StatusPagamento;
  atualizado_por: string | null;
}

export interface Departamento {
  departamento_id: number;
  nome: string;
}

export interface Categoria {
  categoria_id: number;
  nome: string;
}

export interface NewDebt {
  nome: string;
  descricao: string;
  data_competencia: string;
  data_pagamento: string | null;
  valor_total: number;
  numero_parcelas: number;
  periodicidade: number;
  data_vencimento: string;
  conta: string;
  juros: number;
  categoria_nome: string;
  categoria_id: number;
  departamento_nome: string;
  departamento_id: number;
  empresa_grupo: string;
  grupo: number;
  criado_por: string;
}

export interface UpdateDebtStatus {
  debito_id: number;
  status_pagamento_id: number;
}
