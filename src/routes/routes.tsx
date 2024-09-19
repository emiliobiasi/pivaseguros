import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import About from "@/screens/About";
import Home from "@/screens/Home";
import Login from "@/screens/Login";
import PrivateRoute from "@/contexts/auth/PrivateRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route
            path="/sobre"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default RoutesComponent;
