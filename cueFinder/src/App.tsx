import { createBrowserRouter, Outlet, RouterProvider } from "react-router"
import { AuthProvider } from "./screens/Components/AuthProvider"
import './App.css'
import { Header } from "./screens/Header/Header"
import { Footer } from "./screens/Footer/Footer"
import { Main } from "./screens/Main/Main"
import { Login } from "./screens/Auth/Login"
import { SignUp } from "./screens/Auth/SignUp"

function App() {

  const router = createBrowserRouter([
    {
      element: (
        <div>
          <Header />
          <Outlet />
          <Footer />
        </div>
      ),
      children: [
        { path: '/', element: <Main /> },
        { path: '/login', element: <Login /> },
        { path: '/sign-up', element: <SignUp /> }
      ]
    }
  ])


  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
