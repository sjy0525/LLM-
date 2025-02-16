import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ChatWelcome from "../pages/ChatWelcome";
import Chat from "../pages/Chat";
import ChatComponent from "../components/ChatComponent";

const router = createBrowserRouter([
  {
    path: '/',
    // element: <Home></Home>,
    element: <Home></Home>,
    children: [
      {
        index: true,
        element: <ChatWelcome></ChatWelcome>
      },
      {
        path: '/chat/:id',
        element: <Chat></Chat>
      }
    ]
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/chat',
    element: <ChatComponent></ChatComponent>
  }
])

export { router }