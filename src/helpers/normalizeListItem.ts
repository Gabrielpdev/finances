import { ICategoryListItem } from "@/types/data";

/**
 * Normaliza um item da lista de categorias para o formato padrão { key, alias }
 * Compatível com strings legadas e objetos novos
 */
export const normalizeListItem = (
  item: string | ICategoryListItem,
): ICategoryListItem => {
  if (typeof item === "string") {
    // Migração automática: string legada vira { key: string, alias: string }
    return {
      key: item,
      alias: item,
    };
  }

  // Validação: garantir que tem ambos os campos
  if (!item.key) {
    return {
      key: item.alias || "unknown",
      alias: item.alias || "unknown",
    };
  }

  if (!item.alias) {
    return {
      key: item.key,
      alias: item.key, // Se não tem alias, usar a chave
    };
  }

  return item;
};

/**
 * Normaliza a lista completa de itens de uma categoria
 */
export const normalizeListItems = (
  list: (string | ICategoryListItem)[] | undefined,
): ICategoryListItem[] => {
  if (!list || !Array.isArray(list)) {
    return [];
  }

  return list.map(normalizeListItem);
};
