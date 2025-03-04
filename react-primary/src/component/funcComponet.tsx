import React,{ ReactElement, useState,useEffect} from "react"
interface Props {
    name: string
    children: ReactElement
}
function funcComponet() {
    const [count,setCount] = useState(0);
    const [count2,setCount2] = useState(0);
    useEffect(() => {
        console.log("执行副作用函数");
        return () => {
            console.log("清理副作用函数"); 
        }
    },[count])

    const changeCount = () => {
        setCount(count+1);
    }

    return (
        <>
            <div>{count}</div>
            <div>{count2}</div>
            {/* <a href="">{props.children}</a> */}
            <button onClick={changeCount}>add</button>
            <button onClick={() => setCount2(count2 + 1)}>add</button>
        </>
    )
}

export default funcComponet