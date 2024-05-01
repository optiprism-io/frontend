import {
  AuthApi,
  Configuration,
  CustomEventsApi,
  DashboardsApi,
  EventPropertiesApi,
  EventRecordsApi,
  EventsApi,
  GroupRecordsApi,
  OrganizationsApi,
  ProfileApi,
  ProjectsApi,
  PropertiesApi,
  PropertyValuesApi,
  QueryApi,
  ReportsApi,
  SystemPropertiesApi,
  UserPropertiesApi,
} from '@/api'
import { BASE_PATH } from '@/api/base'

const config = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_PATH || BASE_PATH,
})

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
  systemProperties: SystemPropertiesApi
  userProperties: UserPropertiesApi

  constructor() {
    this.auth = new AuthApi(config)
    this.customEvents = new CustomEventsApi(config)
    this.dashboards = new DashboardsApi(config)
    this.eventProperties = new EventPropertiesApi(config)
    this.eventRecords = new EventRecordsApi(config)
    this.events = new EventsApi(config)
    this.groupRecords = new GroupRecordsApi(config)
    this.organizations = new OrganizationsApi(config)
    this.profile = new ProfileApi(config)
    this.projects = new ProjectsApi(config)
    this.properties = new PropertiesApi(config)
    this.propertyValues = new PropertyValuesApi(config)
    this.query = new QueryApi(config)
    this.reports = new ReportsApi(config)
    this.systemProperties = new SystemPropertiesApi(config)
    this.userProperties = new UserPropertiesApi(config)
  }
}

const apiClient = new ApiClient()

export { apiClient }
