import { useEffect, useState } from "react";
import { data, useParams, useNavigate } from "react-router-dom";
import { detailStuApi, delStuApi } from "../api/stuApi";
function Detail() {
    const { id } = useParams();
    const [info, setInfo] = useState("");
    useEffect(() => {
        detailStuApi(id).then(({ data }: any) => {
            setInfo(data);
        });
    }, [id]);
    const navigate = useNavigate();

    const delStu = () => {
        delStuApi(id).then(() => {
            navigate('/home', {
                state: {
                    type: 'info',
                    title: "删除成功"
                }
            })
        })
    }

    return (
        <div className="details container">
            <button className="btn btn-primary" onClick={() => navigate('/home')}>返回</button>
            <h1 className="page-header">
                {info.name}
                <span className="float-end">
                    <button className="btn btn-primary me-1" onClick={() => navigate(`/edit/${id}`)}>修改</button>
                    <button className="btn btn-danger" onClick={delStu}>删除</button>
                </span>
            </h1>
            <ul className="list-group">
                <li className="list-group-item">
                    <span>电话：{info.phone}</span>
                </li>
                <li className="list-group-item">
                    <span>班级：{info.class}</span>
                </li>
            </ul>
        </div>
    )
}

export default Detail;