import { useEffect, useState } from "react";
import { getStuListApi } from "../api/stuApi";
import { useLocation, NavLink } from "react-router-dom";
import Alert from "./Alert";
function Home() {
    const [stuList, setStuList] = useState([]);
    const [search, setSearch] = useState('');
    const [alert, setAlert] = useState(null);
    const [searchList,setSearchList] = useState([]);

    const location = useLocation();
    useEffect(() => {
        getStuListApi().then(res => {
            setStuList(res.data);
        })
    }, [])

    useEffect(() => {
        setAlert(location.state);
    }, [location])

    const showAlert = alert ? <Alert {...alert} /> : null;

    useEffect(() => {
        const _list = stuList.filter(item => {
            return item.name.includes(search);
        });
        setSearchList(_list);
    },[search]);

    const getSearch = (e: any) => {
        setSearch(e);
    }

    const showList = search ? searchList : stuList;
    const stuDom = showList.map((item: any) => {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.class}</td>
                <td>{item.phone}</td>
                <td><NavLink to={'/detail/' + item.id}>详情</NavLink></td>
            </tr>
        )
    })

    return (
        <div>
            {showAlert}
            < h1 > 学生列表</h1 >
            <input className="form-control mb-3" type="text" value={search} onChange={(e) => getSearch(e.target.value)} />
            <table className="table">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>班级</th>
                        <th>联系方式</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {stuDom}
                </tbody>
            </table>
        </div>
    )
};

export default Home;