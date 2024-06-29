/* This file is generated manually */
import {
  AuthApi,
  CustomEventsApi,
  DashboardsApi,
  EventPropertiesApi,
  EventRecordsApi,
  EventsApi,
  GroupPropertiesApi,
  GroupRecordsApi,
  GroupsApi,
  OrganizationsApi,
  ProfileApi,
  ProjectsApi,
  PropertiesApi,
  PropertyValuesApi,
  QueryApi,
  ReportsApi,
  GroupPropertiesApi,
  GroupsApi,
} from '@/api/index'
import { axiosInstance } from '@/plugins/axios'

class ApiClient {
  auth: AuthApi
  customEvents: CustomEventsApi
  dashboards: DashboardsApi
  eventProperties: EventPropertiesApi
  eventRecords: EventRecordsApi
  events: EventsApi
  groupRecords: GroupRecordsApi
  organizations: OrganizationsApi
  profile: ProfileApi
  projects: ProjectsApi
  properties: PropertiesApi
  propertyValues: PropertyValuesApi
  query: QueryApi
  reports: ReportsApi
  groupProperties: GroupPropertiesApi
  groups: GroupsApi

  constructor() {
    this.auth = new AuthApi(undefined, '', axiosInstance)
    this.customEvents = new CustomEventsApi(undefined, '', axiosInstance)
    this.dashboards = new DashboardsApi(undefined, '', axiosInstance)
    this.eventProperties = new EventPropertiesApi(undefined, '', axiosInstance)
    this.eventRecords = new EventRecordsApi(undefined, '', axiosInstance)
    this.events = new EventsApi(undefined, '', axiosInstance)
    this.groupRecords = new GroupRecordsApi(undefined, '', axiosInstance)
    this.organizations = new OrganizationsApi(undefined, '', axiosInstance)
    this.profile = new ProfileApi(undefined, '', axiosInstance)
    this.projects = new ProjectsApi(undefined, '', axiosInstance)
    this.properties = new PropertiesApi(undefined, '', axiosInstance)
    this.propertyValues = new PropertyValuesApi(undefined, '', axiosInstance)
    this.query = new QueryApi(undefined, '', axiosInstance)
    this.reports = new ReportsApi(undefined, '', axiosInstance)
    this.groupProperties = new GroupPropertiesApi(undefined, '', axiosInstance)
    this.groups = new GroupsApi(undefined, '', axiosInstance)
  }
}

const apiClient = new ApiClient()

export { apiClient }
