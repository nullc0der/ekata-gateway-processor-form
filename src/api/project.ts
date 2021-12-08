import { apiBase, jsonAPI } from './base'

import { ProjectInfo } from 'store'

export const getProjectInfo = (projectID: string) => {
    return jsonAPI(apiBase).get<ProjectInfo>(
        `/payment-form/project/get-project-info?project-id=${projectID}`
    )
}
