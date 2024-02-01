import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export enum SDKIntegration {
  javascript = 'javascript',
  android = 'android',
  ios = 'ios',
}

export const pagesMap = {
  login: {
    path: '/login',
    name: 'login',
  },
  eventsLiveStream: {
    path: '/events',
    name: 'eventsLiveStream',
  },
  reportsEventSegmentation: {
    path: '/reports',
    name: 'reportsEventSegmentation',
  },
  dashboards: {
    path: '/dashboards',
    name: 'dashboards',
  },
  funnels: {
    name: 'reports_funnels',
  },
  usersGroupRecords: 'usersGroupRecords',
  usersProperties: 'usersProperties',
  users: 'users',
  reports: 'reports',
  profile: 'profile',
  projectsSettings: 'projectsSettings',
  integration: 'integration',
}

const routes: RouteRecordRaw[] = [
  {
    path: pagesMap.login.path,
    name: pagesMap.login.name,
    component: () => import('@/pages/auth/Login.vue'),
  },
  {
    path: '',
    component: () => import('@/AuthMiddleware.vue'),
    children: [
      {
        path: '',
        redirect: { name: pagesMap.dashboards.name },
      },
      {
        path: pagesMap.users,
        name: pagesMap.users,
        component: () => import('@/pages/users/Users.vue'),
        children: [
          {
            path: '',
            name: pagesMap.usersGroupRecords,
            component: () => import('@/pages/users/GroupRecords.vue'),
          },
          {
            path: 'properties',
            name: pagesMap.usersProperties,
            component: () => import('@/pages/users/Properties.vue'),
          },
        ],
      },
      {
        path: 'events',
        name: 'events',
        component: () => import('@/pages/events/Events.vue'),
        children: [
          {
            path: '',
            name: pagesMap.eventsLiveStream.name,
            component: () => import('@/pages/events/LiveStream.vue'),
          },
          {
            path: 'event_management',
            name: 'events_event_management',
            component: () => import('@/pages/events/EventManagement.vue'),
          },
          {
            path: 'custom_events',
            name: 'events_custom_events',
            component: () => import('@/pages/events/CustomEvents.vue'),
          },
          {
            path: 'event_properties',
            name: 'events_event_properties',
            component: () => import('@/pages/events/EventProperties.vue'),
          },
        ],
      },
      {
        path: pagesMap.dashboards.path,
        name: pagesMap.dashboards.name,
        component: () => import('@/pages/Dashboards.vue'),
      },
      {
        path: pagesMap.reports,
        name: pagesMap.reports,
        component: () => import('@/pages/reports/Reports.vue'),
        children: [
          {
            path: ':id?',
            name: pagesMap.reportsEventSegmentation.name,
            component: () => import('@/pages/reports/EventSegmentation.vue'),
          },
          {
            path: 'funnels/:id?',
            name: 'reports_funnels',
            component: () => import('@/pages/reports/Funnels.vue'),
          },
        ],
      },
      {
        path: pagesMap.profile,
        name: pagesMap.profile,
        component: () => import('@/pages/ProfilePage.vue'),
      },
      {
        path: 'projects/:id/settings',
        name: pagesMap.projectsSettings,
        component: () => import('@/pages/ProjectSettings.vue'),
      },
      {
        path: 'integration/:integration',
        name: pagesMap.integration,
        component: () => import('@/pages/IntegrationPage.vue'),
        beforeEnter: (to, from) => {
          const JsIntegrationRoute = {
            name: pagesMap.integration,
            params: { integration: SDKIntegration.javascript },
          }

          if (!Object.values(SDKIntegration).some(x => x === to.params.integration))
            return JsIntegrationRoute

          /* TODO: remove that when will exists ios and android integration page */
          if (to.params.integration !== SDKIntegration.javascript) return JsIntegrationRoute

          return true
        },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'index',
        redirect: '/',
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
