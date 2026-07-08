import { createRouter, createWebHistory } from "vue-router";
import CustomersView from "@/views/CustomerView.vue";
import IQSView from "@/views/IQSView.vue";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/customers/:id",
      name: "customers",
      component: CustomersView,
    },
    {
      path: "/iqs/:windowName/:id",
      name: "iqs",
      component: IQSView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/iqs/:windowName",
      name: "iqs",
      component: IQSView,
    }
  ],
});

export default router;
