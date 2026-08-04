import SignUp from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import ComposeMail from "./pages/ComposeMail";
import {Navigate} from  "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {

  const token=localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/login"
        element={token ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={<SignUp />}
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/composeMail"
        element={
          <ProtectedRoute>
            <ComposeMail />
          </ProtectedRoute>
        }
      />

    </Routes>

  )

}
export default App;

