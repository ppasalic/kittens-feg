import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseLayout from '@/layouts/BaseLayout.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { requiresAuth: true },
      name: 'Public',
      component: BaseLayout,
      redirect: '/',
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('../views/HomeView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        layout: PublicLayout
      },
      component: () => import('../views/LoginView.vue')
    }
  ]
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.authenticate()) {
    next({ name: 'Login' });
  } else if (to.meta.requiresUnauth && authStore.authenticate()) {
    next('/home');
  } else {
    next();
  }
});

export default router;
