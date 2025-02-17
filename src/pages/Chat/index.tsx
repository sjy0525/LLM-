import { useParams } from 'react-router-dom';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  
  return <div>Chat ID: {id}</div>;
}
  
export default Chat;