import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import bStar from '../asset/imgSJ/blankStar.png'
import star from '../asset/imgSJ/star.png'

const EVLmanner = () => {
  
    // // 내 아이디
    let myId = localStorage.getItem('id')
    // // 평가 대상 아이디
    var str = decodeURI(window.location.search);
    const params = new URLSearchParams(str)
    const oppNick = {name : params.get('nick')}


const [oppId,setOppId]=useState('')

 const navigate = useNavigate()


  const [starList,setStarList] = useState([1,2,3,4,5])

  const [point,setPoint] =useState('star4.png');

const changeStar=(e)=>{

    if(e.target.id==5){
        document.querySelectorAll('img')[4].setAttribute('src',star)
        document.querySelectorAll('img')[5].setAttribute('src',star)
        document.querySelectorAll('img')[6].setAttribute('src',star)
        document.querySelectorAll('img')[7].setAttribute('src',star)
        document.querySelectorAll('img')[8].setAttribute('src',star)
        setPoint('star5.png')
    }else if(e.target.id==4){
        document.querySelectorAll('img')[4].setAttribute('src',star)
        document.querySelectorAll('img')[5].setAttribute('src',star)
        document.querySelectorAll('img')[6].setAttribute('src',star)
        document.querySelectorAll('img')[7].setAttribute('src',star)
        document.querySelectorAll('img')[8].setAttribute('src',bStar)
        setPoint('star4.png')
    }else if(e.target.id==3){
        document.querySelectorAll('img')[4].setAttribute('src',star)
        document.querySelectorAll('img')[5].setAttribute('src',star)
        document.querySelectorAll('img')[6].setAttribute('src',star)
        document.querySelectorAll('img')[7].setAttribute('src',bStar)
        document.querySelectorAll('img')[8].setAttribute('src',bStar)
        setPoint('star3.png')
    }else if(e.target.id==2){
        document.querySelectorAll('img')[4].setAttribute('src',star)
        document.querySelectorAll('img')[5].setAttribute('src',star)
        document.querySelectorAll('img')[6].setAttribute('src',bStar)
        document.querySelectorAll('img')[7].setAttribute('src',bStar)
        document.querySelectorAll('img')[8].setAttribute('src',bStar)
        setPoint('star2.png')
    }else{
        document.querySelectorAll('img')[4].setAttribute('src',star)
        document.querySelectorAll('img')[5].setAttribute('src',bStar)
        document.querySelectorAll('img')[6].setAttribute('src',bStar)
        document.querySelectorAll('img')[7].setAttribute('src',bStar)
        document.querySelectorAll('img')[8].setAttribute('src',bStar)
        setPoint('star1.png')
    }

}

const resStarList = starList.map((item,idx)=><img src={star} key={item+idx} onClick={changeStar} id={idx+1}></img>)
  
let now = new Date();
let year = String(now.getFullYear());
let month = String(now.getMonth()+1);
let date = String(now.getDate());

let today = year+'-'+(month.padStart(2,'0'))+'-'+(date.padStart(2,'0'))

const writeSay = (e)=>{
    setSayInfo(e.target.value)
}
const [sayInfo,setSayInfo]=useState('')

const [evlInfo,setEvlInfo] = useState({})

useEffect(()=>{
    axios
    .post('/gigwork/profile/nameToId',oppNick)
    .then(res=>setOppId(res.data))
    .catch(e=>console.log(e))
    
},[oppNick,sayInfo])

useEffect(()=>{
    setEvlInfo({targetId:oppId,oppId:myId,evlPoint:point,evlContent:sayInfo,evlDate:today})
},[oppId,myId,point,sayInfo,setPoint])

const saveEvl=()=>{
    axios
    .post('/gigwork/profile/evl',evlInfo)
    .then(res=>console.log(res))
    .catch(e=>console.log(e))
    if(point == 'star5.png'){
        axios
        .post('/gigwork/profile/evl5',oppNick)
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }else if(point == 'star4.png'){
        axios
        .post('/gigwork/profile/evl4',oppNick)
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }else if(point == 'star2.png'){
        axios
        .post('/gigwork/profile/evl2',oppNick)
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }else if(point == 'star1.png'){
        axios
        .post('/gigwork/profile/evl1',oppNick)
        .then(res=>console.log(res))
        .catch(e=>console.log(e))
    }
    navigate('/')
}

    return (
    <div className='top_div'>
        <div className='mannerContainer'>
            <div>
                <h1>{oppNick.name}님 매너평가 남기기</h1>
            </div>
            <div>
            <h3>별점 평가</h3>
            </div>
            <div className='starContainer'>
                {resStarList}
            </div>
            <div>
                <h3>{oppNick.name}님께 남길 말</h3>
            </div>
            <div className='mannerCommentContainer'> 
                <textarea  id="say" rows="2" onChange={writeSay}></textarea>
            </div>
            <div>
                <span id='savePF'onClick={saveEvl}>평가 남기기</span>
            </div>
        </div>
    </div>
  )
}

export default EVLmanner