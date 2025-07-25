import { useContext } from "react";
import { AuthImobiliariaContext } from "./AuthContextImobiliarias";

export const useAuthImobiliarias = () => {
  const context = useContext(AuthImobiliariaContext);

  if (!context) {
    throw new Error(
      "useAuthImobiliarias must be used within an AuthImobiliariaProvider"
    );
  }

  return context;
};
