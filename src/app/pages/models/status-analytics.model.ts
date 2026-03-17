export interface StatusAnalyticsHistory {
  id: number;
  nome: string;
  quantidade: number;
}

export interface StatusAnalyticsByRegion {
  regiao_id: number;
  ativo: number;
  frio: number;
  atencao: number;
  inativo: number;
}

export interface StatusAnalyticsResolvedData {
  dates: string[];
  analytics: StatusAnalyticsByRegion[];
}

export interface RegionDashboardData {
  nome: string;
  status: {
    nome: string;
    quantidade: number;
    cor: string;
    statusId: number;
    diff: number;
  }[];
}
