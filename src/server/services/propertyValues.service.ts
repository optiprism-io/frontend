import type { Server } from 'miragejs'

export function propertyValuesRoutes(server: Server) {
  server.post('/projects/:project_id/property-values', (_, request) => {
    const propertyName = request.queryParams?.property_name
    let values = []

    if (propertyName === 'Country') {
      values = ['Spain', 'USA', 'United Kingdom', 'Poland']
    } else {
      values = ['Furniture', 'Doors', 'Lamp', 'Tables', 'Shelves']
    }

    return { data: values }
  })
}
