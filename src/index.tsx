import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import App from 'containers/App'
import reportWebVitals from './reportWebVitals'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0.1,
    })
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
