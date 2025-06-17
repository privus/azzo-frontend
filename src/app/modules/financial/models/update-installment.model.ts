export class UpdateInstallment {
  parcela_id: number;
  status_pagamento_id?: number;
  data_pagamento?: string;
  valor_total?: number;
  atualizado_por: string;
  obs?: string;
  data_vencimento?: string;
  venda_id?: number;
  account_id?: number;
  account_name?: string;
  user_company_id?: number;
}
