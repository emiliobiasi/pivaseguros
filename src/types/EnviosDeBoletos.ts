import { Imobiliaria } from "./Imobiliarias";

export type EnvioDeBoletos = {
  id: string;
  imobiliaria: string;
  arquivos: string[];
  finalizado: boolean;
  created: Date;
  expand?: {
    imobiliaria?: Imobiliaria;
  };
};
