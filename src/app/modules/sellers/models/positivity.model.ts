export interface PositivityByBrandResponse {
  [vendedor: string]: VendedorPositivacao;
}

export interface VendedorPositivacao {
  totalClientes: number;
  clientesPositivados: number;
  positivacaoGeral: number; // Ex: "18.49%"
  marcas: {
    [marca: string]: MarcaPositivacao;
  };
}

export interface MarcaPositivacao {
  clientesPositivados: number;
  positivacaoMarca: number;
  contribuicaoPercentual: number;
}
