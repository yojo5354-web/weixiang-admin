import { defineConfig } from '@umijs/max';
import { resolve } from 'path';

export default defineConfig({
  mfsu: false,
  alias: {
    umi: resolve(__dirname, 'src/.umi/exports.ts'),
  },
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: '@/pages/login' },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/dashboard', component: '@/pages/dashboard/index' },
        {
          path: '/content',
          name: '内容管理',
          routes: [
            { path: '/content/list', component: '@/pages/content/list' },
            { path: '/content/review', component: '@/pages/content/review' },
            { path: '/content/report', component: '@/pages/content/report' },
            { path: '/content/tag', component: '@/pages/content/tag' },
          ],
        },
        {
          path: '/user',
          name: '用户管理',
          routes: [
            { path: '/user/list', component: '@/pages/user/list' },
            { path: '/user/detail/:id', component: '@/pages/user/detail' },
            { path: '/user/permission', component: '@/pages/user/permission' },
          ],
        },
        {
          path: '/commercial',
          name: '商业管理',
          routes: [
            { path: '/commercial/order', component: '@/pages/commercial/order' },
            { path: '/commercial/recipe', component: '@/pages/commercial/recipe' },
            { path: '/commercial/ad', component: '@/pages/commercial/ad' },
            { path: '/commercial/settlement', component: '@/pages/commercial/settlement' },
          ],
        },
        {
          path: '/stats',
          name: '数据统计',
          routes: [
            { path: '/stats/user', component: '@/pages/stats/user' },
            { path: '/stats/content', component: '@/pages/stats/content' },
            { path: '/stats/commercial', component: '@/pages/stats/commercial' },
          ],
        },
        {
          path: '/ai',
          name: 'AI服务',
          routes: [
            { path: '/ai/monitor', component: '@/pages/ai/monitor' },
            { path: '/ai/stats', component: '@/pages/ai/stats' },
          ],
        },
        {
          path: '/system',
          name: '系统设置',
          routes: [
            { path: '/system/banner', component: '@/pages/system/banner' },
            { path: '/system/topic', component: '@/pages/system/topic' },
            { path: '/system/keyword', component: '@/pages/system/keyword' },
          ],
        },
        { path: '/settings', component: '@/pages/settings/index' },
      ],
    },
  ],
  npmClient: 'npm',
});
