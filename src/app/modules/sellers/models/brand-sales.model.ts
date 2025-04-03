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

export interface VendedorDisplay {
  nome: string;
  totalFaturado: number;
  totalPedidos: number;
  marcasList: {
    nome: string;
    valor: number;
    cor: string;
  }[];
}
