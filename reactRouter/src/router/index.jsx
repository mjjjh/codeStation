import { useRoutes, Navigate } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import AddOrEdit from "../components/AddOrEdit";
import Detail from "../components/Detail";
import Email from "../components/email";
import Phone from "../components/Phone";

// <Routes>
// <Route path='/' element={<Navigate to="/home" replace={true}></Navigate>}></Route>
// <Route path='/home' element={<Home />}></Route>
// <Route path='/about' element={<About />}></Route>
// <Route path='/detail/:id' element={<Detail />}></Route>
// <Route path='/add' element={<AddOrEdit />}></Route>
// <Route path='/edit/:id' element={<AddOrEdit />}></Route>
// </Routes>

function Router() {
    return useRoutes([
        { path: "/", element: <Navigate to="/home" /> },
        {
            path: "/home",
            element: <Home />,
        },
        { 
            path: "/about", 
            element: <About /> ,
            children:[
                {
                    path: 'email',
                    element: <Email />
                },
                {
                    path: 'phone',
                    element: <Phone />
                },
                {
                    path: "",
                    element: <Navigate replace to="email" />
                }
            ]
        },
        { path: "/add", element: <AddOrEdit /> },
        { path: "/edit/:id", element: <AddOrEdit /> },
        { path: "/detail/:id", element: <Detail /> },
    ])
}

export default Router;