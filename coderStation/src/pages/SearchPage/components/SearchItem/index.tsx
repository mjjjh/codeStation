import React from "react";
import IssueItem from "@/pages/Issues/components/IssueItem";
import BookItem from "@/pages/Book/components/BookItem";
import { IBookResData, IIssueResData } from "@/types/api";
import useScreenSize  from "@/hooks/useScreenSize";

interface ISearchItem {
    result: IIssueResData | IBookResData,
}

const SearchItem: React.FC<ISearchItem> = ({ result }) => {
    const isMobile = useScreenSize();
    function isIssue(result: any): result is IIssueResData {
        return "issueTitle" in result;
    }
    return (
        isIssue(result) ? <IssueItem issue={result} isMobile={isMobile}></IssueItem> : <BookItem bookInfo={result}></BookItem>
    )
}

export default SearchItem