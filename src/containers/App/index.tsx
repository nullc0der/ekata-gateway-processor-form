import { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { Modal } from 'react-bootstrap'
import find from 'lodash/find'

import Main from 'pages/Main'
import Error from 'pages/Error'
import { projectInfoAtom, projectErrorAtom, paymentDatasAtom } from 'store'
import { getProjectInfo } from 'api/project'
import { sendMessageToParent } from 'utils/common'
import './App.scss'

function App() {
    const [projectID, setProjectID] = useState('')
    const [formID, setFormID] = useState('')
    const [projectInfo, setProjectInfo] = useAtom(projectInfoAtom)
    const [projectError, setProjectError] = useAtom(projectErrorAtom)
    const [paymentDatas] = useAtom(paymentDatasAtom)

    const hasSuccessfulPayment = find(paymentDatas, (o) => o.signature?.length)

    const handleEvents = useCallback(
        (event: MessageEvent) => {
            if (event.origin !== projectInfo?.domain_name) {
                return
            }
            switch (event.data.type) {
                case 'SET_FORM_ID':
                    const formID = event.data.payload.formID
                    !formID
                        ? setProjectError({
                              errorCode: '-103',
                              reason: 'Form id is invalid',
                          })
                        : setFormID(event.data.payload.formID)
                    break
            }
        },
        [projectInfo?.domain_name, setProjectError]
    )

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const projectID = urlParams.get('project-id') || ''
        setProjectID(projectID)
    }, [])

    useEffect(() => {
        if (projectID.length) {
            getProjectInfo(projectID).then((response) => {
                if (response.ok && response.data) {
                    setProjectInfo(response.data)
                } else {
                    if (response.status === 404 || response.status === 422) {
                        setProjectError({
                            errorCode: '-102',
                            reason: 'Project id is invalid',
                        })
                    }
                }
            })
        }
    }, [projectID, setProjectInfo, setProjectError])

    useEffect(() => {
        if (projectInfo) {
            if (!projectInfo.domain_name) {
                setProjectError({
                    errorCode: '-100',
                    reason: 'No domain name was set',
                })
            }
            if (!projectInfo.enabled_currency?.length) {
                setProjectError({
                    errorCode: '-101',
                    reason: 'Minimum one currency should be enabled for project',
                })
            }
            if (document.referrer.slice(0, -1) !== projectInfo.domain_name) {
                setProjectError({
                    // TODO: This might not be correct error code, we need to add all error code in single file
                    errorCode: '-106',
                    reason: 'Project is hosted on other domain',
                })
            } else {
                sendMessageToParent(projectInfo, { type: 'GET_FORM_ID' })
                window.addEventListener('message', handleEvents)
            }
        }
        return () => window.removeEventListener('message', handleEvents)
    }, [projectInfo, setProjectError, handleEvents])

    useEffect(() => {
        if (projectError) {
            sendMessageToParent(projectInfo, {
                type: 'PROJECT_ERROR',
                payload: projectError,
            })
        }
    }, [projectInfo, projectError])

    const sendCancelMessage = () => {
        sendMessageToParent(projectInfo, { type: 'USER_CANCEL' })
    }

    return (
        <Modal show>
            <Modal.Body>
                <span
                    className={`material-icons close-btn ${
                        Boolean(hasSuccessfulPayment) && 'd-none'
                    }`}
                    onClick={sendCancelMessage}>
                    close
                </span>
                {!projectError ? (
                    <Main projectInfo={projectInfo} formID={formID} />
                ) : (
                    <Error />
                )}
            </Modal.Body>
        </Modal>
    )
}

export default App
