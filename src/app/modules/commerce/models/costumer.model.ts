import { Vendedor } from './';

export interface Cliente {
  cliente_id: number;
  codigo: number;
  nome: string;
  nome_empresa: string;
  tipo_doc: string;
  numero_doc: string;
  ie?: string;
  email: string;
  celular: string;
  telefone_comercial?: string;
  cep?: string;
  endereco?: string;
  num_endereco?: string;
  bairro?: string;
  complemento?: string;
  data_criacao?: string;
  ativo?: number;
  cidade: Cidade;
  cidade_string: string;
  categoria: CategoriaCliente;
  status_cliente: StatusCliente;
  regiao?: Regiao;
  ultima_compra?: string;
  prox_status?: number;
  valor_ultima_compra?: number;
  categoria_cliente: CategoriaCliente;
  segmento_id: number;
}

export interface Cidade {
  cidade_id: number;
  nome: string;
  estado: Estado;
}

export interface CategoriaCliente {
  categoria_id: number;
  nome: string;
}

export interface Estado {
  estado_id: number;
  nome: string;
  sigla: string;
}

export interface StatusCliente {
  status_cliente_id: number;
  nome: string;
}

export interface Regiao {
  regiao_id: number;
  codigo: number;
  nome: string;
  vendedores: Vendedor[];
}

export interface PCliente {
  cliente_id: number;
  tiny_id?: number;
  nome: string;
  tipo_doc?: string;
  numero_doc?: string;
  data_criacao: Date | string;
  ultima_compra?: Date | string;
  valor_ultima_compra?: number;
  cidade_string?: string;
  cidade: Cidade;
  status_cliente?: StatusCliente;
}
