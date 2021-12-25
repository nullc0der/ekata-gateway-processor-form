import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { projectErrorAtom } from 'store'

const Error = () => {
    const [projectError] = useAtom(projectErrorAtom)
    const [errorText, setErrorText] = useState('')

    useEffect(() => {
        if (projectError) {
            switch (projectError.errorCode) {
                case '-100':
                case '-101':
                case '-102':
                case '-103':
                case '-105':
                case '-106':
                    setErrorText(
                        "Uh oh! We couldn't load the payment form," +
                            ' please contact the website maintainer for further assistance'
                    )
                    break
                case '-104':
                    setErrorText(
                        'Something was wrong while creating a wallet address, please try later'
                    )
                    break
            }
        }
    }, [projectError])

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4">
            <p>{errorText}</p>
        </div>
    )
}

export default Error
