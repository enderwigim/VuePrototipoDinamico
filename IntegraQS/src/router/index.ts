import { createRouter, createWebHistory } from "vue-router";
import CustomersView from "@/views/CustomerView.vue";
import IQSView from "@/views/IQSView.vue";
import LoginView from "@/views/LoginView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/customers/:id",
      name: "customers",
      component: CustomersView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/iqs/:windowName/:id?",
      name: "iqs",
      component: IQSView,
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/SearchControlerView.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.accessToken) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

export default router;
