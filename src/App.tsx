import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Admin } from "./pages/admin";
import { Networks } from "./pages/networks";
import { NotFound } from "./pages/notFound";
import { Signup } from "./pages/signup";

import { Private } from "./routes/Private";

const router = createBrowserRouter([
  {
    path:"login",
    element: <Login/>
  },
  {
    path:"/user/:username",
    element: <Home/>
  },
  {
    path:"/signup",
    element: <Signup/>
  },
  {
    path:"/",
    element: <Private> <Admin/> </Private>
  },
  {
    path:"admin",
    element: <Private> <Admin/> </Private>
  },
  {
    path:"/admin/social",
    element: <Private> <Networks/> </Private> 
  },
  {
    path:"*",
    element: <NotFound/>
  }
])

export { router }