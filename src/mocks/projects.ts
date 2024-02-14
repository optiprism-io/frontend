import { Project } from '@/api'
import { generateUUID } from '@/utils/generateUuid'
import { getRandomValue } from '@/utils/getRandomValue'

export const getNewProject = ({
  name,
  sessionDurationSeconds,
}: Pick<Project, 'name' | 'sessionDurationSeconds'>): Project => ({
  id: getRandomValue(),
  sessionDurationSeconds,
  name,
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
  createdBy: Date.now(),
  updatedBy: Date.now(),
  sdkToken: generateUUID(),
  eventsCount: 0,
})

export default [
  {
    id: 1,
    createdAt: '2024-01-22T16:11:34.530Z',
    updatedAt: '2024-01-22T16:11:34.530Z',
    createdBy: 0,
    updatedBy: 0,
    name: 'medium.com Web',
    sessionDurationSeconds: 7500,
    sdkToken: '3463f4e9-8151-48cd-ae96-2c9e06daeaf8',
    eventsCount: 0,
  },
  {
    id: 2,
    createdAt: '2024-01-22T16:11:34.530Z',
    updatedAt: '2024-01-22T16:11:34.530Z',
    createdBy: 0,
    updatedBy: 0,
    name: 'https://peopleforce.io/',
    sessionDurationSeconds: 7500,
    sdkToken: '3463f4e9-8151-48cd-ae96-2c9e06daeaf8',
    eventsCount: 0,
  },
]
