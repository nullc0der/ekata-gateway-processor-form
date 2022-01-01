import { ReactComponent as Loader } from 'assets/svg/loader.svg'

const LoadingAnimation = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 p-4">
            <div style={{ width: '150px', height: '150px' }}>
                <Loader fill="#6c757d" />
            </div>
        </div>
    )
}

export default LoadingAnimation
