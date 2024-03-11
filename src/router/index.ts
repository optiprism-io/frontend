import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { checkCreatedProject, isAuth } from '@/router/routerGuards'

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
  createProject: 'createProject',
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
  organizations: 'organizations',
  organizationList: 'organizationList',
  organization: 'organization',
  organizationOverview: 'organizationOverview',
  organizationProjectList: 'organizationProjectList',
  organizationProject: 'organizationProject',
}

const ONLY_NUMBER_REG_EXP = '(\\d+)'

const routes: RouteRecordRaw[] = [
  {
    path: pagesMap.login.path,
    name: pagesMap.login.name,
    component: () => import('@/pages/auth/Login.vue'),
  },

  /* pages are accessible without a created project */
  {
    path: '/projects/create',
    component: () => import('@/layout/MainLayout.vue'),
    beforeEnter: [isAuth],
    children: [
      {
        path: '',
        name: pagesMap.createProject,
        component: () => import('@/pages/CreateProject.vue'),
      },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layout/MainLayout.vue'),
    beforeEnter: [isAuth],
    children: [
      {
        path: '',
        name: pagesMap.profile,
        component: () => import('@/pages/ProfilePage.vue'),
      },
    ],
  },

  /* pages are accessible only with a created project */
  {
    path: '',
    component: () => import('@/layout/MainLayout.vue'),
    beforeEnter: [isAuth, checkCreatedProject],
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
        path: 'projects/:id/settings',
        name: pagesMap.projectsSettings,
        component: () => import('@/pages/projectSettings/ProjectSettings.vue'),
      },
      {
        path: 'organizations',
        name: pagesMap.organizations,
        redirect: { name: pagesMap.organizationList },
        meta: {
          breadcrumb: 'Organizations',
        },
        children: [
          {
            path: '',
            name: pagesMap.organizationList,
            component: () => import('@/pages/organization/OrganizationList.vue'),
          },
          {
            path: ':id' + ONLY_NUMBER_REG_EXP,
            redirect: { name: pagesMap.organizationOverview },
            name: pagesMap.organization,
            component: () => import('@/pages/organization/OrganizationPage.vue'),
            children: [
              {
                path: 'overview',
                name: pagesMap.organizationOverview,
                component: () => import('@/pages/organization/OrganizationOverview.vue'),
                meta: {
                  breadcrumb: 'Overview',
                },
              },
              {
                path: 'projects',
                name: pagesMap.organizationProjectList,
                component: () => import('@/pages/organization/OrganizationProjects.vue'),
                meta: {
                  breadcrumb: 'Projects',
                },
                children: [
                  {
                    path: ':projectId' + ONLY_NUMBER_REG_EXP,
                    name: pagesMap.organizationProject,
                    component: () => import('@/pages/organization/OrganizationProject.vue'),
                    meta: {
                      breadcrumb: 'Project',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: 'integration',
        redirect: {
          name: pagesMap.integration,
          params: { integration: SDKIntegration.javascript },
        },
        children: [
          {
            /* TODO: change regexp to ":integration(javascript|android|ios)" when pages ios and android are added */
            path: ':integration(javascript)',
            name: pagesMap.integration,
            component: () => import('@/pages/IntegrationPage.vue'),
          },
        ],
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
