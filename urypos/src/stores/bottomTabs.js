import { defineStore } from "pinia";
import { useAuthStore } from "./Auth.js";
import router from "../router";
import { useAlert } from "./Alert.js";
import { useTableStore } from "./Table.js";
import { useMenuStore } from "./Menu.js";

export const tabFunctions = defineStore("tabClick", {
  state: () => ({
    auth: useAuthStore(),
    alert: useAlert(),
    menu: useMenuStore(),
    table: useTableStore(),
  }),
  getters: {
    isLoginPage() {
      return router.currentRoute.value.path === "/login";
    },
    currentTab() {
      return router.currentRoute.value.path;
    },
  },
  actions: {
    checkActiveTable() {
      if (!this.table.selectedTable) {
        this.alert
          .createAlert(
            "Nenhuma Mesa Ativa",
            "Você não selecionou uma mesa ativa",
            "Ok"
          )
          .then(() => {
            router.push("/Table");
          });
      }
    },
    clickMenuTab() {
      if (!this.auth.cashier && !this.table.selectedTable) {
        this.alert
          .createAlert(
            "Nenhuma Mesa Ativa",
            "Você não selecionou uma mesa ativa",
            "Ok"
          )
          .then(() => {
            router.push("/Table");
          });
      }
      if (this.auth.cashier && !this.menu.selectedOrderType) {
        this.alert
          .createAlert(
            "Nenhum Tipo de Pedido",
            "Selecione um Tipo de Pedido",
            "Ok"
          )
          .then(() => {
            router.push("/Table");
          });
      }
      if (
        this.auth.cashier &&
        this.menu.selectedOrderType === "Aggregators" &&
        !this.menu.selectedAggregator
      ) {
        this.alert
          .createAlert("Nenhum Agregador", "Selecione um Agregador", "Ok")
          .then(() => {
            router.push("/Table");
          });
      }
    },
  },
});
