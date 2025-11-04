import React from "react";
import IssueItem from "@/pages/Issues/components/IssueItem";
import BookItem from "@/pages/Book/components/BookItem";
import { IBookResData, IIssueResData } from "@/types/api";

interface ISearchItem {
    result: IIssueResData | IBookResData,
}

const SearchItem: React.FC<ISearchItem> = ({ result }) => {
    function isIssue(result: any): result is IIssueResData {
        return "issueTitle" in result;
    }
    return (
        isIssue(result) ? <IssueItem issue={result}></IssueItem> : <BookItem bookInfo={result}></BookItem>
    )
}

export default SearchItem