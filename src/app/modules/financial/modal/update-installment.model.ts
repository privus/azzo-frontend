export class UpdateInstallment {
  parcela_id: number;
  status_pagamento_id: number;
  data_pagamento: string;
  valor_total: number;
  atualizado_por: string;
  obs: string;
  data_vencimento?: string;
}
