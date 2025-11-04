import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import style from "./style.module.css"
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const AddButton: React.FC = () => {
    const navigate = useNavigate()
    const { isLogin } = useSelector((state: RootState) => state.user)

    return (
        <div >
            {isLogin && <Button
                type="primary"
                className={style.addButton}
                onClick={() => navigate("/addIssue")}
            >我要发问</Button>}
        </div>
    )
}

export default AddButton