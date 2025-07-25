export function formatDate(dateString: string): string {
  // Remove todos os caracteres não numéricos
  dateString = dateString.replace(/\D/g, "")

  // Limita a entrada a 8 dígitos (DDMMAAAA)
  dateString = dateString.substring(0, 8)

  // Aplica a formatação de data: DD/MM/AAAA
  if (dateString.length > 4) {
    dateString = dateString.replace(/^(\d{2})(\d{2})(\d+)/, "$1/$2/$3")
  } else if (dateString.length > 2) {
    dateString = dateString.replace(/^(\d{2})(\d+)/, "$1/$2")
  }

  return dateString
}
