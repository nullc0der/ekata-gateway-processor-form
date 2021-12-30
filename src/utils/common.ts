import { ProjectInfo } from 'store'

export const sendMessageToParent = (
    projectInfo: ProjectInfo | null,
    message: { type: string; payload?: any }
) => {
    if (message.type === 'USER_CANCEL') {
        window.parent.postMessage(message, '*')
    } else {
        if (
            message.payload?.errorCode === '-102' ||
            message.payload?.errorCode === '-106'
        ) {
            window.parent.postMessage(message, '*')
        } else {
            if (projectInfo && projectInfo.domain_name) {
                window.parent.postMessage(message, projectInfo.domain_name)
            }
        }
    }
}
