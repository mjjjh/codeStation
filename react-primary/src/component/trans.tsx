import { useState } from 'react'
import Money from './money'

function Trans() {
  const [infos,setInfos] = useState<{
    rmb: string | number,
    dollar: string | number
  }>({
    rmb: "",
    dollar: ""
  })

  const transformToDollar = (value) => {
    if(parseFloat(value) || parseFloat(value) === 0 || value === ''){
      setInfos({ 
        rmb: value,
        dollar: value * 0.14
      }) 
    } else {
      alert('请输入数字')
    } 
  }
  const transformToRmb = (value) => {
    if(parseFloat(value) || parseFloat(value) === 0 || value === ''){
      setInfos({
        rmb:value * 7.29,
        dollar: value
      })
    } else {
      alert('请输入数字')
    }
  }

  const ele = (
    <>
      <Money title='人民币' value={infos.rmb} trans={transformToDollar}></Money>
      <Money title='美元' value={infos.dollar} trans={transformToRmb}></Money>
    </>
  )
  return ele

}

export default Trans
