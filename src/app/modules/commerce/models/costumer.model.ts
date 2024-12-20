export interface Cliente {
  cliente_id: number;
  codigo: number;
  nome: string;
  nome_empresa: string;
  tipo_doc?: string;
  numero_doc?: string;
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
  status: number;
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
