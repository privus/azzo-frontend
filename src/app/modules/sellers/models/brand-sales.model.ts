export interface Marca {
  quantidade: number;
  valor: number;
}

export interface Vendedor {
  totalPedidos: number;
  totalFaturado: number;
  marcas: {
    [key: string]: Marca;
  };
}

export interface BrandSales {
  [nome: string]: Vendedor;
}

// Interface para exibição no componente
export interface VendedorDisplay {
  nome: string;
  totalFaturado: number;
  marcasList: {
    nome: string;
    valor: number;
    cor: string;
  }[];
}
