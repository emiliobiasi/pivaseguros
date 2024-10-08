export function formatRG(rg: string): string {
    // Remove all non-digit characters
    rg = rg.replace(/\D/g, "");
  
    // Limit the RG to 9 digits (RG numbers can have 7 to 9 digits)
    rg = rg.slice(0, 9);
  
    // Apply RG formatting: x.xxx.xxx-x or xx.xxx.xxx-x
    if (rg.length === 9) {
      // For 9-digit RGs
      rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
    } else if (rg.length === 8) {
      // For 8-digit RGs
      rg = rg.replace(/(\d{1})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
    } else if (rg.length === 7) {
      // For 7-digit RGs
      rg = rg.replace(/(\d{1})(\d{3})(\d{2})(\d)/, "$1.$2.$3-$4");
    }
  
    return rg;
  }
  