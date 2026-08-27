// Display-only translations for values that come from the backend in English
// (POS Invoice order_type / status options). The underlying values are kept
// in English everywhere else since business logic compares against them.

const ORDER_TYPE_LABELS = {
  "Dine In": "No Local",
  "Phone In": "Por Telefone",
  "Take Away": "Para Viagem",
  Delivery: "Delivery",
  Aggregators: "Aplicativos",
};

const ORDER_STATUS_LABELS = {
  Draft: "Rascunho",
  Unbilled: "Em Aberto",
  "Recently Paid": "Pagos Recentes",
  Paid: "Pago",
  Consolidated: "Consolidado",
  Return: "Devolução",
};

export function translateOrderType(value) {
  return ORDER_TYPE_LABELS[value] || value;
}

export function translateOrderStatus(value) {
  return ORDER_STATUS_LABELS[value] || value;
}
