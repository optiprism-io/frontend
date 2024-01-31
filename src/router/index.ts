import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const SDKIntegration = {
  javascript: 'java-script',
  android: 'android',
  ios: 'ios',
} as const

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
  projects: {
    main: 'projects',
    settings: 'projectsSettings',
  },
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
        path: pagesMap.projects.main,
        name: pagesMap.projects.main,
        redirect: { name: pagesMap.projects.settings },
        children: [
          {
            path: ':id?/settings',
            name: pagesMap.projects.settings,
            component: () => import('@/pages/ProjectSettings.vue'),
            beforeEnter: (to, from) => {
              if (!to.params.id) return false
              return true
            },
          },
        ],
      },
      {
        path: 'integration/:integration',
        name: pagesMap.integration,
        component: () => import('@/pages/IntegrationPage.vue'),
        beforeEnter: (to, from) => {
          if (!Object.values(SDKIntegration).some(x => x === to.params.integration))
            return {
              name: pagesMap.integration,
              params: { integration: SDKIntegration.javascript },
            }
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
