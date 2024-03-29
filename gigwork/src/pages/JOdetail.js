import React, { useEffect, useState } from 'react'
import userPic from '../asset/imgJY/user.png'
import starpic from '../asset/imgJY/bookmark.png'
import '../css/JOdetail.css'
import voidpic from '../asset/imgJY/void.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const JOdetail = () => {


    //post_num 받고 proDetail에 저장하기
    var str = decodeURI(window.location.search);
    const params = new URLSearchParams(str);
    const proDetail = { post_num: params.get('post_num') }
    const [postdetail, setPostdetail] = useState({})
    const urgentmark = <span> {postdetail.urgent}</span>
    const [bookmarkcount, setBookmarkcount] = useState()
    
    const date = new Date
    const bookmark = bookmarkcount != 0 ? starpic : voidpic
    
    
    
    const [bookMarkIcon, setbookMarkIcon] = useState(bookmark);
    
    useEffect(() => {
        const config = { "Content-Type": 'application/json' };

        axios
            .post('gigwork/my/mybookmark',
                { mem_id: localStorage.getItem("id"), post_num: proDetail.post_num }, config)
            .then(res => { console.log(res.data) })
            .catch(e => console.log(e))

    }, [setbookMarkIcon])

    const clickBookmark = (e) => {
        if (bookmarkcount==1) {
            setbookMarkIcon(voidpic)
            setBookmarkcount(0)
        } else if(bookmarkcount==0) {
            setbookMarkIcon(starpic)
            setBookmarkcount(1)
        }
    }

    // 페이지 이동을 위한 navigate 생성
    const navigate = useNavigate()
    // 채팅 페이지 연결
    const goToChat = () => {
        if (localStorage.getItem('nick') === null) {
            navigate('/login')
        } else {
            axios
                .post('gigwork/chat/createCR', { mem_nick: localStorage.getItem('nick'), partner_nick: postdetail.name, post_num: params.get('post_num') })
                .then(res => console.log(res))
                .catch(e => console.log(e));
            navigate('/chat')
        }
    }


    useEffect(() => {
        axios
            .post('gigwork/my/mypost', proDetail)
            .then(res => setPostdetail(res.data))
            .catch(e => console.log(e))

        // bookmark 여부 가져오기
        axios
            .post('gigwork/my/searchBookmark', { mem_id: localStorage.getItem("id"), post_num: proDetail.post_num })
            .then(res => {
                setBookmarkcount(res.data)
            })
            .catch(e => console.log('오류?', e))
    }, [])





    // 모달 창

    function MyVerticallyCenteredModal(props) {


        const [wantPay, setWantPay] = useState(0)
        // input창에 가격 입력하면 가격 저장
        const handlePay = (e) => {
            setWantPay(e.target.value)
        }
        // 제의하기 버튼 누르면 모달창 끄고 원하는 가격 콘솔에 띄우기
        const deal = () => {
            let now = new Date();
            // 채팅 방 생성
            axios
                .post('gigwork/chat/makeOffer', { mem_nick: localStorage.getItem('nick'), partner_nick: props.partner_nick, post_num: props.post_num, post_title: props.post_title, wantPay: wantPay })
                .then(res => console.log(res.data))
                .catch(e => console.log(e));
            // 연결된 웹소켓서버에 정보를 전달
            // socket.send(JSON.stringify({ talker: localStorage.getItem("nick"), msg: localStorage.getItem("nick")+'님이 '+props.post_title+' 글에 가격 제안을 보냈어요!', msg_time: now, sendto: props.partner_nick, cr_seq: "" }));
            // 창 끄기
            props.onHide()
            navigate('/chat')
        }
        return (
            <Modal
                {...props}
                size="5em"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        가격 제의하기
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br />
                    <h4>원하는 가격을 입력해 주세요</h4>
                    <br />
                    <input id='wantPayInput' type='number' onChange={handlePay}></input>원
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={deal}>제의하기</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const [modalShow, setModalShow] = React.useState(false);
    // 모달 창

    const offerBtnClick = () => {
        localStorage.getItem('nick') === null
            ? navigate('/login')
            : setModalShow(true)
    }

    


    return (
        <div> <div className='top'>
            <div>

                <div className='containerB'>
                    <div className='toppart'>
                        <div className='userpart'>
                            <div className='picandnick'>
                                <div className='nickpart'>
                                    <img src={userPic} width='20px' id='userpic'></img>

                                </div>
                                <div className='user'>
                                    <span>{postdetail.name}</span>
                                </div>
                            </div>
                            <div className='trustpart'>
                                <div>

                                    {urgentmark === 1 ? <span>''</span> : <div className='urgentmark'>급구</div>}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='contentpart'>
                        <div className='titlepart'>
                            <span id='titlepart'>{postdetail.title} </span>
                            <br />
                            <div className='subtitle'>
                                <span id='category'>
                                    {postdetail.post_cate}
                                </span>
                                <span id='time'>
                                    {new Date(+date + 3240 * 10000).toISOString().replace('T', ' ').replace(/\..*/, '')}
                                </span>
                                <span id='write'>작성</span>
                            </div>
                            <div className='contentpart'>

                                <p id='content'>
                                    {postdetail.content}
                                    <img src={postdetail.img_src} id='imgcontent' />

                                    <br /></p>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div className='tradepart'>

                        
                        <div className='tradebtn'>

                            <label htmlFor='bookmark' >
                                
                                <img width='30px' src={bookMarkIcon} />
                                <input type='checkbox' id='bookmark' onClick={clickBookmark} style={{ display: "none" }} />
                            </label>
                        </div>
                        <div className='price'>
                            <span> {postdetail.post_pay} 원</span>
                        </div>

                        <div className='offerbtnpart'>
                            <button id='offerbtn' onClick={offerBtnClick}>제의하기</button>
                            <MyVerticallyCenteredModal
                                partner_nick={postdetail.name}
                                post_num={params.get('post_num')}
                                post_title={postdetail.title}
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            />
                        </div>




                        <div className='chat'>
                            <button onClick={goToChat} id='chatbtn'>채팅으로 거래하기</button><br />
                        </div>


                    </div>


                </div>

            </div>
        </div>

        </div>
    )
}

export default JOdetail