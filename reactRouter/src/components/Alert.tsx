function Alert(props: any) {

    return (
        <div className={['alert', `alert-${props.type}`, 'alert-dismissible', 'fade', 'show'].join(' ')} role="alert">
            <strong>{props.type}</strong> {props.title}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}

export default Alert;