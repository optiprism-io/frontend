export interface ProjectErrors {
  updateProject: {
    name?: Error
    sessionDurationSeconds?: Error
  }
}

export interface ProjectEdit {
  name: boolean
  sessionDurationSeconds: boolean
}