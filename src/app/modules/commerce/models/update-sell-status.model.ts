export class UpdateSellStatus {
  codigo: number;
  status_venda_id?: number;
  numero_nfe?: number;
  valor_frete?: number;
}

export class UpdateSellPerson {
  codigo: number;
  status_pagamento_id?: number;
  numero_nfe?: number;
  forma_pagamento_id?: number;
  forma_pagamento_nome?: string | null;
}
