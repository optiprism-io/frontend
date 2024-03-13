import { createServer } from 'miragejs'
import { DataType } from '@/api'
import { BASE_PATH } from '@/api/base'
import { EventStatus, UserCustomProperty } from '@/types/events'
import liveStreamMocks from '@/mocks/reports/liveStream.json'
import funnelsMocks from '@/mocks/reports/funnels.json'
import userPropertiesMocks from '@/mocks/eventSegmentations/userProperties.json'
import eventSegmentationsMocks from '@/mocks/eventSegmentations/eventSegmentations.json'
import eventPropertiesMocks from '@/mocks/eventSegmentations/eventProperties.json'
import customProperties from '@/mocks/eventSegmentations/customProperties.json'
import customEventsMocks from '@/mocks/eventSegmentations/customEvents.json'
import eventMocks from '@/mocks/eventSegmentations/events.json'
import reportsMocks from '@/mocks/reports/reports.json'
import dashboardsMocks from '@/mocks/dashboards'
import groupRecordsMocks from '@/mocks/groupRecords.json'
import profileMocks from '@/mocks/profile'
import { profileRoutes } from '@/server/services/profile.service'
import { EMPTY_SUCCESS_RES, nanoid } from '@/server/constants'
import { getRandomTiming } from '@/server/utils/getRandomTiming'
import { projectsRoutes } from '@/server/services/projects.service'
import projectsMocks from '@/mocks/projects'
import { authRoutes } from '@/server/services/auth.service'

const urlPrefix = BASE_PATH + '/' + import.meta.env.VITE_API_VERSION

const dbTemplate: { [k: string]: any } = {
  events: eventMocks,
  customEvents: customEventsMocks,
  eventProperties: eventPropertiesMocks,
  userProperties: userPropertiesMocks,
  customProperties: customProperties,
  reports: reportsMocks,
  dashboards: dashboardsMocks,
  groupRecords: groupRecordsMocks,
  liveStreamMocks: liveStreamMocks,
  projects: projectsMocks,
}

const requiredTemplate = {
  profile: profileMocks,
}

const dbTemplateKeys = Object.keys(dbTemplate)

const emptyDbTemplate = dbTemplateKeys.reduce((acc: { [key: string]: [] }, key) => {
  acc[key] = []
  return acc
}, {})

export default function ({ environment = 'development', isSeed = true } = {}) {
    return createServer({
        environment,
        urlPrefix,

        /* timing of all requests */
        timing: getRandomTiming(),

        seeds(server) {
            server.db.loadData(isSeed ? dbTemplate : emptyDbTemplate);
            server.db.loadData(requiredTemplate)
        },

        routes() {
            this.get('/projects/:project_id/schema/events', (schema) => {
                return { data: schema.db.events }
            })

            this.put('/projects/:project_id/schema/events/:event_id', (schema, request) => {
                const customEvent = JSON.parse(request.requestBody)

                return schema.db.events.update(request.params.event_id, customEvent)
            })

            this.get('/projects/:project_id/schema/custom-events', (schema) => {
                return {
                    data: schema.db.customEvents.map(item => ({ ...item, id: Number(item.id) })),
                };
            })

            this.delete('/projects/:project_id/schema/custom-events/:event_id', (schema, request) => {
                return EMPTY_SUCCESS_RES;
            })

            this.post('/projects/:project_id/schema/custom-events', (schema, request) => {
                const customEvents = JSON.parse(request.requestBody)

                return schema.db.customEvents.insert(customEvents)
            })

            this.put('/projects/:project_id/schema/custom-events/:event_id', (schema, request) => {
                const customEvent = JSON.parse(request.requestBody)
                schema.db.customEvents.update(request.params.event_id, customEvent)

                return schema.db.customEvents
            })

            this.post('/projects/:project_id/event-records/search', (schema, request) => {
                return schema.db.liveStreamMocks
            })

            this.get('/projects/:project_id/schema/event-properties', (schema) => {
                return {
                    data: schema.db.eventProperties
                }
            })

            this.put('/projects/:project_id/schema/event-properties/:property_id', (schema, request) => {
                const property = JSON.parse(request.requestBody)
                return schema.db.eventProperties.update(request.params.property_id, property)
            })

            this.get('/projects/:project_id/schema/user-properties', (schema) => {
                return {
                    data: schema.db.userProperties.map(item => ({
                        ...item,
                        id: Number(item.id),
                    })),
                };
            })

            this.put('/projects/:project_id/schema/user-properties/:property_id', (schema, request) => {
                const property = JSON.parse(request.requestBody)
                return schema.db.userProperties.update(request.params.property_id, property)
            })

            this.get('/projects/:project_id/schema/custom-properties', () => {
                return {
                    events: this.schema.db.customProperties,
                };
            });

            this.get('/schema/user-custom-properties', (): UserCustomProperty[] => {
                return [
                    {
                        id: 1,
                        createdBy: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        updatedBy: 0,
                        projectId: 1,
                        events: [],
                        isSystem: false,
                        isGlobal: true,
                        tags: [],
                        name: 'Custom user prop',
                        displayName: 'Custom user prop',
                        description:
                            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto, temporibus.',
                        status: EventStatus.Enabled,
                        type: DataType.String,
                        isRequired: false,
                        isArray: false,
                        nullable: false,
                        isDictionary: true,
                        dictionaryType: DataType.Number
                    }
                ];
            });

            this.post('/projects/:project_id/property-values', (_, request) => {
                const propertyName = request.queryParams?.property_name
                let values = []

                if (propertyName === 'Country') {
                    values = ['Spain', 'USA', 'United Kingdom', 'Poland']
                } else {
                    values = ['Furniture', 'Doors', 'Lamp', 'Tables', 'Shelves']
                }

                return { data: values }
            });

            this.get('/projects/:project_id/reports', (schema) => {
                return {
                    data: schema.db.reports.map(item => ({
                        ...item,
                        id: Number(item.id),
                    })),
                    meta: {}
                }
            })

            this.post('/projects/:project_id/reports', (schema, request) => {
                const body = JSON.parse(request.requestBody);

                return schema.db.reports.insert({
                    id: nanoid(),
                    ...body,
                })
            })

            this.get('/projects/:project_id/reports/:report_id', (schema, request) => {
                return schema.db.reports.find(request.params.report_id);
            })

            this.put('/projects/:project_id/reports/:report_id', (schema, request) => {
                const body = JSON.parse(request.requestBody);
                return schema.db.reports.update(request.params.report_id, body)
            })

            this.delete('/projects/:project_id/reports/:report_id', (schema, request) => {
                schema.db.reports.remove(request.params.report_id)
                return request.params.report_id;
            })

            this.post('/projects/:project_id/queries/event-segmentation', (_, request) => {
                const body = JSON.parse(request.requestBody);

                if (body.events?.length || body?.segments?.length) {
                    return eventSegmentationsMocks;
                } else {
                    return {
                        columns: []
                    };
                }
            })

            /* TODO: `/projects/:project_id/queries/funnel` doesn't work. Try to solve this problem. */
            this.post(`${BASE_PATH}/projects/:project_id/queries/funnel`, (schema, request) => {
                return funnelsMocks
            })

            this.get('/projects/:project_id/dashboards', (schema) => {
                return {
                    data: schema.db.dashboards,
                    meta: {}
                }
            })

            this.post('/projects/:project_id/dashboards', (schema, request) => {
                const body = JSON.parse(request.requestBody)
                return schema.db.dashboards.insert({
                    id: nanoid(),
                    ...body,
                })
            })

            this.put('/projects/:project_id/dashboards/:dashboard_id', (schema, request) => {
                const requestBody = JSON.parse(request.requestBody)
                return schema.db.dashboards.update(request.params.dashboard_id, requestBody)
            })

            this.delete('/projects/:project_id/dashboards/:dashboard_id', (schema, request) => {
                schema.db.dashboards.remove(request.params.dashboard_id)
                return request.params.dashboard_id;
            })

            /**
             * Group-records
             *
             * post
             * put
             */
            this.post('/projects/:project_id/group-records/search', (schema) => {
                return {
                    data: schema.db.groupRecords,
                };
            });

            this.put('/projects/:project_id/group-records/:id', (schema, request) => {
                return schema.db.groupRecords.update(request.params.id, JSON.parse(request.requestBody));
            });
            /**
             * end Group-records
             */

            authRoutes(this),
                profileRoutes(this)
            projectsRoutes(this)
        }
    });
}
