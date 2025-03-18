import { useEffect, useState } from "react"
import { addStuApi, detailStuApi, alterStuApi } from "../api/stuApi";
import { useNavigate, useParams } from "react-router-dom";
function AddOrEdit() {
    const navigate = useNavigate();
    const { id } = useParams()
    console.log(id);

    const [infos, setInfos] = useState({
        name: "",
        class: "",
        phone: ""
    })
    useEffect(() => {
        if (id) {
            detailStuApi(id).then(({ data }) => {
                setInfos(data);
            })
        }
    }, [id])



    const contentInput = (e: any, key: keyof typeof infos) => {
        const _ = { ...infos, [key]: e.target.value };
        setInfos(_);
    }

    const submit = (e: any) => {
        e.preventDefault();
        const _id = id ?? Math.random().toString();
        if (id) {
            alterStuApi(id, infos).then(() => {
                navigate('/home', {
                    state: {
                        type: 'success',
                        title: '用户修改成功'
                    }
                });
            })
        } else {
            addStuApi({ ...infos, id: _id }).then(() => {
                navigate('/home', {
                    state: {
                        type: 'success',
                        title: '用户添加成功'
                    }
                });
            })
        }

    }

    return (
        <div className="container">
            <h1>添加用户</h1>
            <form id="myForm" onSubmit={submit}>
                <div className="well">
                    <div className="form-group mb-3">
                        <label htmlFor="">姓名</label>
                        <input type="text" className="form-control" value={infos.name} onChange={(e) => contentInput(e, 'name')} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="">班级</label>
                        <input type="text" className="form-control" value={infos.class} onChange={(e) => contentInput(e, 'class')} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="">联系方式</label>
                        <input type="text" className="form-control" value={infos.phone} onChange={(e) => contentInput(e, 'phone')} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddOrEdit