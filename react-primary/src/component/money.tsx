function Money(props){

    const noticyUpper = (e) => {
        props.trans(e.target.value)
    }

    return (
        <fieldset>
            <legend>{props.title}</legend>
            <input value={props.value} onChange={noticyUpper}/>
        </fieldset>
    )
}

export default Money;