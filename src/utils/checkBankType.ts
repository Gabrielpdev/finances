export function checkBankType(csv: string): "nubank" | "xp" | "mercadoPago" {
  const isNu = csv.includes("Data,Valor,Identificador,Descrição");
  if (isNu) {
    return "nubank";
  }

  const isMp = csv.includes("INITIAL_BALANCE;CREDITS;DEBITS;FINAL_BALANCE");
  if (isMp) {
    return "mercadoPago";
  }

  return "xp";
}
