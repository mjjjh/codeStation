import { Routes, Route, Navigate } from "react-router-dom";
import Issues from "../pages/Issues";
import IssueDetail from "@/pages/IssueDetail";
import Books from "../pages/Book";
import BookDetail from "../pages/BookDetail";
import Interviews from "../pages/Interview";
import AddIssue from "@/pages/AddIssue";
import SearchPage from "@/pages/SearchPage";
import { useSelector } from "react-redux";

export default function RouterConfig() {
    const { userInfo } = useSelector((state: any) => state.user);
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/issues" />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/issue/detail/:id" element={<IssueDetail />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/detail/:id" element={<BookDetail />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="/interviews" element={<Interviews />} />
            <Route path="/addIssue" element={userInfo._id ? <AddIssue /> : <Navigate replace to="/" />} />
        </Routes>
    )
}