import dashboardsMocks from '@/mocks/dashboards'
import customEventsMocks from '@/mocks/eventSegmentations/customEvents.json'
import customProperties from '@/mocks/eventSegmentations/customProperties.json'
import eventPropertiesMocks from '@/mocks/eventSegmentations/eventProperties.json'
import eventMocks from '@/mocks/eventSegmentations/events.json'
import groupProperties from '@/mocks/groupProperties'
import groupRecordsMocks from '@/mocks/groupRecords.json'
import groups from '@/mocks/groups'
import { organizations } from '@/mocks/organizations'
import profileMocks from '@/mocks/profile'
import projectsMocks from '@/mocks/projects'
import eventRecordMocks from '@/mocks/reports/eventRecord.json'
import liveStreamMocks from '@/mocks/reports/liveStream.json'
import { reports } from '@/mocks/reports/reports'

export const dbTemplate: { [k: string]: any } = {
  events: eventMocks,
  customEvents: customEventsMocks,
  eventProperties: eventPropertiesMocks,
  customProperties: customProperties,
  reports: reports,
  dashboards: dashboardsMocks,
  groupRecords: groupRecordsMocks,
  liveStream: liveStreamMocks,
  eventRecord: eventRecordMocks,
  projects: projectsMocks,
  organizations: organizations,
  groups: groups,
  groupProperties: groupProperties,
}

export const requiredTemplate = {
  profile: profileMocks,
}

const dbTemplateKeys = Object.keys(dbTemplate)

export const emptyDbTemplate = dbTemplateKeys.reduce((acc: { [key: string]: [] }, key) => {
  acc[key] = []
  return acc
}, {})
