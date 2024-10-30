export interface Estado {
  estadoId: number;
  nome: string;
  sigla: string;
}

export interface Cidade {
  cidadeId: number;
  nome: string;
  estado: Estado;
}

export interface Cargo {
  cargoId: number;
  nome: string;
}

export interface Regiao {
  regiaoId: number;
  nome: string;
}

export interface Usuario {
  usuarioId: number;
  nome: string;
  email: string;
  celular: string;
  endereco: string;
  dataNascimento: string;
  username: string;
  cargo: Cargo;
  cidade: Cidade;
  regiao: Regiao | null;
}
