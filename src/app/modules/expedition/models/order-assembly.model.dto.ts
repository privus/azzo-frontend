export interface AssemblyDto {
  montagemId?: number;
  responsavel: string;
  status: 'iniciada' | 'pausada' | 'finalizada';
  motivoPausa?: string;
  itens: {
    itensVendaId: number;
    scannedCount: number;
  }[];
}

export interface AssemblyResponse {
  codigo: number;
  progress: { itensVendaId: number; scannedCount: number }[];
  status: 'iniciada' | 'pausada' | 'finalizada' | 'nao_iniciada';
  montagemId: number | null;
}
