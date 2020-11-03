import React, {useState, useEffect} from 'react' ;
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';


    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
 
        socket.emit('join', {name, room},(error)=>{
            if(error) alert(error);
        });
        // return statements are used for unmounting
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT,location.search])

    useEffect(()=>{
        socket.on('message', (messgae)=>{
            setMessages([...messages,messgae]);
        })
    },[messages])

    const sendMessage = (event) =>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message , ()=>setMessage(''));
        }
    }
    console.log(message);
    console.log(messages);
    return (
        <div className = "outterContainer">   
            <div className = "container">
                <input value={message} onChange= {(event) => setMessage(event.target.value)} onKeyPress={(event)=>event.key==='Enter'? sendMessage(event) :null} /> 
            </div>
        </div>
    )

    
}


export default Chat; 