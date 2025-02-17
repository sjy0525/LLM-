import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import ChatWelcome from "../pages/ChatWelcome"
import Chat from "../pages/Chat"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    children: [
      {
        index: true,
        element: <ChatWelcome></ChatWelcome>,
      },
      {
        path: "/chat/:id",
        element: <Chat></Chat>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
])

export { router }
