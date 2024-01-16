import { createServer, Response } from 'miragejs';
import { useUrlSearchParams } from '@vueuse/core';
import { customAlphabet } from 'nanoid';
import {
    DataType,
    TokensResponse,
    UpdateProfileEmailRequest,
    UpdateProfileNameRequest,
    UpdateProfilePasswordRequest,
} from '@/api';
import { BASE_PATH } from '@/api/base';
import { EventStatus, UserCustomProperty } from '@/types/events';
import splineChartMocks from '@/mocks/splineChart.json';
import liveStreamMocks from '@/mocks/reports/liveStream.json';
import funnelsMocks from '@/mocks/reports/funnels.json';
import userPropertiesMocks from '@/mocks/eventSegmentations/userProperties.json';
import eventSegmentationsMocks from '@/mocks/eventSegmentations/eventSegmentations.json';
import eventPropertiesMocks from '@/mocks/eventSegmentations/eventProperties.json';
import customProperties from '@/mocks/eventSegmentations/customProperties.json';
import customEventsMocks from '@/mocks/eventSegmentations/customEvents.json';
import eventMocks from '@/mocks/eventSegmentations/events.json';
import reportsMocks from '@/mocks/reports/reports.json';
import dashboardsMocks from '@/mocks/dashboards';
import groupRecordsMocks from '@/mocks/groupRecords.json';
import profileMocks, { userId } from '@/mocks/profile';

const alphabet = '0123456789';
const nanoid = customAlphabet(alphabet, 4);
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im5pa28ga3VzaCIsImlhdCI6MTUxNjIzOTAyMn0.FzpmXmStgiYEO15ZbwwPafVRQSOCO_xidYjrjRvVIbQ';
const csrfToken = 'CIwNZNlR4XbisJF39I8yWnWX9wX4WFoz';

const TokensResponse = {
    accessToken,
    refreshToken,
    csrfToken,
}

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
    profile: profileMocks
};

/* TODO: move to separate file */
enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

enum Stub {
    ERROR= 'error'
}

const dbTemplateKeys = Object.keys(dbTemplate);
const getRandomTiming = (from = 0, to = 0) => {
    // TODO ADD HEADER SWITCHER OR URL SEARCH PARAMETR LIKE => timingMocks=100-200
    return Math.floor(Math.random() * (to - from)) + from;
}

const EMPTY_SUCCESS_RES = 'done'
const EMPTY_HEADER_RESPONSE = { some: 'header' }

const emptyDbTemplate = dbTemplateKeys.reduce((acc: { [key: string]: [] }, key) => {
    acc[key] = [];
    return acc;
}, {});

export default function ({ environment = 'development', isSeed = true } = {}) {
    const params = useUrlSearchParams('history');

    if (params?.emptyMocks) {
        const values = (typeof params.emptyMocks === 'string' ? [params.emptyMocks] : params.emptyMocks).map(item => item.split(',')).flat();
        values.forEach(key => {
            if (dbTemplate && dbTemplate[key]) {
                dbTemplate[key] = [];
            }
        });
    }

    return createServer({
        environment,
        namespace: 'api',
        seeds(server) {
            server.db.loadData(isSeed ? dbTemplate : emptyDbTemplate);
        },
        routes() {
            this.get(`${BASE_PATH}/shutdown`, () =>  {
                this.shutdown();
                return 'shutdown';
            });

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/events`, (schema) => {
                return { data: schema.db.events }
            }, { timing: getRandomTiming() })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/events/:event_id`, (schema, request) => {
                const customEvent = JSON.parse(request.requestBody)

                return schema.db.events.update(request.params.event_id, customEvent)
            }, { timing: getRandomTiming() })

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/custom-events`, (schema) => {
                return {
                    data: schema.db.customEvents.map(item => ({...item, id: Number(item.id)})),
                };
            })

            this.delete(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/custom-events/:event_id`, (schema, request) => {
                return EMPTY_SUCCESS_RES;
            })

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/custom-events`, (schema, request) => {
                const customEvents = JSON.parse(request.requestBody)

                return schema.db.customEvents.insert(customEvents)
            }, { timing: getRandomTiming() })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/custom-events/:event_id`, (schema, request) => {
                const customEvent = JSON.parse(request.requestBody)
                schema.db.customEvents.update(request.params.event_id, customEvent)

                return schema.db.customEvents
            })

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/event-records/search`, (schema, request) => {
                return {
                    events: schema.db.liveStreamMocks,
                };
            })

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/event-properties`, (schema) => {
                return { data: schema.db.eventProperties }
            })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/event-properties/:property_id`, (schema, request) => {
                const property = JSON.parse(request.requestBody)
                return schema.db.eventProperties.update(request.params.property_id, property)
            })

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/user-properties`, (schema) => {
                return {
                    data: schema.db.userProperties.map(item => ({
                        ...item,
                        id: Number(item.id),
                    })),
                };
            }, { timing: getRandomTiming() })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/user-properties/:property_id`, (schema, request) => {
                const property = JSON.parse(request.requestBody)
                return schema.db.userProperties.update(request.params.property_id, property)
            }, { timing: getRandomTiming() })

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/schema/custom-properties`, () => {
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

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/property-values`, (_, request) => {
                const propertyName = request.queryParams?.property_name
                let values = []

                if (propertyName === 'Country') {
                    values = ['Spain', 'USA', 'United Kingdom', 'Poland']
                } else {
                    values = ['Furniture', 'Doors', 'Lamp', 'Tables', 'Shelves']
                }

                return { data: values }
            });

            this.get('/chart', (): any[] => {
                return splineChartMocks;
            });

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/reports`, (schema) => {
                return {
                    data: schema.db.reports.map(item => ({
                        ...item,
                        id: Number(item.id),
                    })),
                    meta: {}
                }
            })

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/reports`, (schema, request) => {
                const body = JSON.parse(request.requestBody);

                return schema.db.reports.insert({
                    id: nanoid(),
                    ...body,
                })
            }, { timing: getRandomTiming() })

            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/reports/:report_id`, (schema, request) => {
                return schema.db.reports.find(request.params.report_id);
            })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/reports/:report_id`, (schema, request) => {
                const body = JSON.parse(request.requestBody);
                return schema.db.reports.update(request.params.report_id, body)
            }, { timing: getRandomTiming() })

            this.delete(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/reports/:report_id`, (schema, request) => {
                schema.db.reports.remove(request.params.report_id)
                return request.params.report_id;
            })

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/queries/event-segmentation`, (_, request) => {
                const body = JSON.parse(request.requestBody);

                if (body.events?.length || body?.segments?.length) {
                    return eventSegmentationsMocks;
                } else {
                    return {
                        columns: []
                    };
                }
            })

            this.post(`${BASE_PATH}/organizations/:organization_id/projects/:project_id/queries/funnel`, (schema, request) => {
                return funnelsMocks
            })

            /** AUTH */
            this.post(`${BASE_PATH}/v1/auth/login`, (_, request) => {
                const property = JSON.parse(request.requestBody)

                if (property.email.length <= 5 || property.password.length < 5) {
                    return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                        'code': '1000_invalid_token',
                        'fields': {
                            'email': 'Email is too short',
                        }
                    });
                } else {
                    return TokensResponse
                }
            })

            this.post(`${BASE_PATH}/v1/auth/refresh-token`, (): TokensResponse => {
                return TokensResponse
            }, { timing: getRandomTiming() })

            /**
             * dashboards
             */
            this.get(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/dashboards`, (schema) => {
                return {
                    data: schema.db.dashboards,
                    meta: {}
                }
            })

            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/dashboards`, (schema, request) => {
                const body = JSON.parse(request.requestBody)
                return schema.db.dashboards.insert({
                    id: nanoid(),
                    ...body,
                })
            }, { timing: getRandomTiming() })

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/dashboards/:dashboard_id`, (schema, request) => {
                const requestBody = JSON.parse(request.requestBody)
                return schema.db.dashboards.update(request.params.dashboard_id, requestBody)
            }, { timing: getRandomTiming() })

            this.delete(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/dashboards/:dashboard_id`, (schema, request) => {
                schema.db.dashboards.remove(request.params.dashboard_id)
                return request.params.dashboard_id;
            }, { timing: getRandomTiming() })

            /**
             * Group-records
             *
             * post
             * put
             */
            this.post(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/group-records/search`, (schema) => {
                return {
                    data: schema.db.groupRecords,
                };
            }, { timing: getRandomTiming() });

            this.put(`${BASE_PATH}/v1/organizations/:organization_id/projects/:project_id/group-records/:id`, (schema, request) => {
                return schema.db.groupRecords.update(request.params.id, JSON.parse(request.requestBody));
            }, { timing: getRandomTiming() });
            /**
             * end Group-records
             */

            /**
             * Profile
             */
            this.get(`${BASE_PATH}/v1/profile`, (schema) => {
                return schema.db.profile.at(0)
            }, { timing: 1000 }),

            this.put(`${BASE_PATH}/v1/profile/name`, (schema, request) => {
                const { name } = JSON.parse(request.requestBody) as UpdateProfileNameRequest
 
                if (name.toLowerCase() === Stub.ERROR) return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                    'fields': {
                        'name': 'Name is incorrect',
                    }
                })
                
                schema.db.profile.update(userId, { name })
                return EMPTY_SUCCESS_RES
            }, { timing: 1000 })

            this.put(`${BASE_PATH}/v1/profile/email`, (schema, request) => {
                const { email, password } = JSON.parse(
                    request.requestBody
                ) as UpdateProfileEmailRequest;

                if (password.toLowerCase() === Stub.ERROR) return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                    'fields': {
                        'password': 'Password is incorrect',
                    }
                })

                schema.db.profile.update(userId, { email })
                return TokensResponse
            }, { timing: 1000 })

            this.put(`${BASE_PATH}/v1/profile/password`, (schema, request) => {
                const { password, newPassword } = JSON.parse(
                    request.requestBody
                ) as UpdateProfilePasswordRequest;

                if (password.toLowerCase() === Stub.ERROR && newPassword.toLowerCase() === Stub.ERROR) return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                    'fields': {
                        'password': 'Password is incorrect',
                        'newPassword': 'Password is incorrect',
                    }
                })

                if (password.toLowerCase() === Stub.ERROR) return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                    'fields': {
                        'password': 'Password is incorrect',
                    }
                })
                
                if (newPassword.toLowerCase() === Stub.ERROR) return new Response(HttpStatusCode.BAD_REQUEST, EMPTY_HEADER_RESPONSE, {
                    'fields': {
                        'newPassword': 'Password is incorrect',
                    }
                })

                schema.db.profile.update(userId, { password: newPassword })
                return TokensResponse
            }, { timing: 1000 })
        }
    });
}
