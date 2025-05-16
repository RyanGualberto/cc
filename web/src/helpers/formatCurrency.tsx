/**
 * Formata um valor numérico como moeda (R$)
 *
 * @param value - O valor a ser formatado
 * @param options - Opções de formatação
 * @returns String formatada como moeda
 */
export function formatCurrency(
  value: number,
  options: {
    currency?: string;
    locale?: string;
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string {
  const {
    currency = "BRL",
    locale = "pt-BR",
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Tratamento para valores nulos ou indefinidos
  if (value === null || value === undefined) {
    return showSymbol ? "R$ 0,00" : "0,00";
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? "currency" : "decimal",
      currency: showSymbol ? currency : undefined,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    return formatter.format(value);
  } catch (error) {
    // Fallback em caso de erro com a API Intl
    const formattedValue = value.toFixed(minimumFractionDigits);
    const [integerPart, decimalPart] = formattedValue.split(".");

    // Formata a parte inteira com separadores de milhar
    const formattedIntegerPart = integerPart?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ".",
    );

    // Retorna o valor formatado
    return showSymbol
      ? `R$ ${formattedIntegerPart},${decimalPart}`
      : `${formattedIntegerPart},${decimalPart}`;
  }
}

/**
 * Converte uma string formatada como moeda para um número
 *
 * @param formattedValue - String formatada como moeda
 * @returns Valor numérico
 */
export function parseCurrency(formattedValue: string): number {
  if (!formattedValue) return 0;

  // Remove o símbolo da moeda e espaços
  let value = formattedValue.replace(/[R$\s]/g, "");

  // Substitui vírgula por ponto para decimal
  value = value.replace(/\./g, "").replace(",", ".");

  return Number.parseFloat(value) || 0;
}
