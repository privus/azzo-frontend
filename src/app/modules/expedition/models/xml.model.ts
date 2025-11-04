export interface Xml {
  estoque_id: number;
  quantidade_total: number;
  origem: string;
  data_entrada: Date;
  numero_nfe: string;
  preco_custo_unitario: number;
  valor_total: number;
  produto: string;
  distribuidor: string;
}

export interface NfResume {
  nfe_resumo_id: number;
  numero_nfe: string;
  emitente: string;
  valor_produto: number;
  valor_ipi: number;
  valor_st: number;
  valor_base_icms: number;
  valor_total_nfe: number;
  data_emissao: Date | null;
  data_entrada: Date | null;
  valor_icms?: number | null;
  valor_base_icms_st?: number | null;
  valor_pis?: number | null;
  valor_cofins?: number | null;
  chegou: number | null;
  reimportada: number | null;
}
