import React from "react";

class ClassComponent extends React.Component {
    render() {
        return (
            <>
            <div>Class Component22</div>
            <span>{this.props.name}</span>
            </>
        );
    }
}
export default ClassComponent;