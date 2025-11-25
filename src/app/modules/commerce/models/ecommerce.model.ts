export interface Ecommerce {
  ecommerce_id: number;
  codigo: number;
  data_pedido: Date;
  total_pedido: number;
  cod_bling: number;
  cliente_cod: number;
  cliente_nome: string;
  numero_doc: string;
  cliente_tipo: string;
  status_id: number;
  loja_id: number;
}

export interface ProductOrderEcommerce {
  nome: string;
  codigo: string;
  quantidade: number;
}
