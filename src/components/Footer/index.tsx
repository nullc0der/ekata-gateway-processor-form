import { Badge } from 'react-bootstrap'
import classnames from 'classnames'

import s from './Footer.module.scss'

const Footer = () => {
    const cx = classnames(s.container)
    return (
        <div className={cx}>
            <span className="text-muted text-center">
                Exchange rates sync every five minutes
            </span>
            <a
                href="https://gpconsole.ekata.io"
                target="_blank"
                rel="noreferrer">
                <Badge bg="primary" pill>
                    Processed by Ekata.io
                </Badge>
            </a>
        </div>
    )
}

export default Footer
