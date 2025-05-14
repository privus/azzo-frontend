import { Order } from '../../commerce/models';

export interface Romaneio {
  romaneio_id: number;
  data_criacao: string;
  vendas: Order[];
  transportadora: Transportadora;
}

export interface NewRomaneio {
  codigos: number[];
  transportadora_id: number;
  transportadora_nome: string;
  data_criacao: string;
}

export interface Transportadora {
  transportadora_id: number;
  nome: string;
}
