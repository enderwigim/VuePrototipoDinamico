import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/customers',
    //   name: 'customers',
    //   component: CustomersView
    // },
  ],
});

export default router;
