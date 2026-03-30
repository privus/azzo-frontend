export interface StatusRecord {
  vendedor: string;
  atual: number;
  record: number;
  bateu_recorde: boolean;
  regiao_id: number;
}

export interface StatusByRegion {
  regiao_id: number;
  regiao_nome: string;
  ativo: number;
  frio: number;
  atencao: number;
  inativo: number;
}
