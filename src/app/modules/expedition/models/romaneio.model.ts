import { Order } from '../../commerce/models';

export interface Romaneio {
  romaneio_id: number;
  data_criacao: string;
  vendas: Order[];
}
