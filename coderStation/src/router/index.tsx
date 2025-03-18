import { Routes,Route, Navigate } from "react-router-dom";
import Issues from "../pages/Issues";
import Books from "../pages/Book";
import Interviews from "../pages/Inerview";

export default function RouterConfig(){
    return (
        <Routes>
            <Route path="/" element={<Navigate replace  to="/issues" />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/books" element={<Books />} />
            <Route path="/interviews" element={<Interviews />} />
        </Routes> 
    )
}