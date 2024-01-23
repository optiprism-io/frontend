export interface ProjectErrors {
  updateProject: {
    name?: Error
    sessionTimeoutSeconds?: Error
  }
}

export interface ProjectEdit {
  name: boolean
  sessionTimeoutSeconds: boolean
}