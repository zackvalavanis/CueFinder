import { createBrowserRouter, Outlet, RouterProvider } from "react-router"
import { AuthProvider } from "./screens/Components/AuthProvider"
import './App.css'
import { Header } from "./screens/Header/Header"
import { Footer } from "./screens/Footer/Footer"
import { Main } from "./screens/Main/Main"

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
        { path: '/', element: <Main /> }
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
