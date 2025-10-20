import React from "react";
import { Button } from "antd";
import style from "./style.module.css"

const AddButton: React.FC = () => {
    return (
        <div >
            <Button
                type="primary"
                className={style.addButton}
            >我要发问</Button>
        </div>
    )
}

export default AddButton