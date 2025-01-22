export type EnvioDeBoletos = {
  id: string;
  imobiliaria: string;
  arquivos: string[];
  finalizado: boolean;
  created?: Date;
};
