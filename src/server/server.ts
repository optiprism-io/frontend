import { createServer } from 'miragejs'

import { faker } from '@/server/faker'
import { authRoutes } from '@/server/services/auth.service'
import { customEventsRoutes } from '@/server/services/customEvents.service'
import { dashboardsRoutes } from '@/server/services/dashboards.service'
import { eventPropertiesRoutes } from '@/server/services/eventProperties.service'
import { eventRecordsRoutes } from '@/server/services/eventRecords.service'
import { eventsRoutes } from '@/server/services/events.service'
import { groupPropertiesRoutes } from '@/server/services/groupProperties.service'
import { groupRecordsRoutes } from '@/server/services/groupRecords.service'
import { groupsRoutes } from '@/server/services/groups.service'
import { organizationsRoutes } from '@/server/services/organizations.service'
import { profileRoutes } from '@/server/services/profile.service'
import { projectsRoutes } from '@/server/services/projects.service'
import { propertiesRoutes } from '@/server/services/properties.service'
import { propertyValuesRoutes } from '@/server/services/propertyValues.service'
import { queryRoutes } from '@/server/services/query.service'
import { reportsRoutes } from '@/server/services/reports.service'
import { dbTemplate, emptyDbTemplate, requiredTemplate } from '@/server/templates'

const urlPrefix = import.meta.env.VITE_API_BASE_PATH + '/' + import.meta.env.VITE_API_VERSION
const SESSION_STORAGE_KEY = 'db'

export function makeHttpServer({ environment = 'development', isSeed = true } = {}) {
  const server = createServer({
    environment,
    urlPrefix,

    /* timing of all requests. Min and max are random milliseconds for request */
    timing: faker.number.int({ min: 0, max: 0 }),

    seeds(server) {
      const dbData = sessionStorage.getItem(SESSION_STORAGE_KEY)

      if (dbData) {
        server.db.loadData(JSON.parse(dbData))
      } else {
        server.db.loadData(isSeed ? dbTemplate : emptyDbTemplate)
        server.db.loadData(requiredTemplate)
      }
    },

    routes() {
      eventsRoutes(this)
      propertiesRoutes(this)
      reportsRoutes(this)
      authRoutes(this)
      profileRoutes(this)
      organizationsRoutes(this)
      projectsRoutes(this)
      dashboardsRoutes(this)
      groupsRoutes(this)
      customEventsRoutes(this)
      groupPropertiesRoutes(this)
      eventPropertiesRoutes(this)
      eventRecordsRoutes(this)
      groupRecordsRoutes(this)
      propertyValuesRoutes(this)
      queryRoutes(this)
    },
  })

  /* It saves the current state of the MirageJS server's database to the session storage. */
  const mirageRequestHandler = server.pretender.handledRequest

  server.pretender.handledRequest = function (verb, path, request) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(server.db.dump()))
    mirageRequestHandler(verb, path, request)
  }
}
