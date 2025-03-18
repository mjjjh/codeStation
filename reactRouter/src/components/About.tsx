import { Outlet,NavLink } from "react-router-dom";

function About(){
    return (
        <div>
            <NavLink to='/about/email'>邮箱</NavLink>
            <NavLink to='/about/phone'>手机</NavLink>
            <Outlet />
        </div>
    )
};

export default About;