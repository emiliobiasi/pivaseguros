import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "@/screens/About";
import Home from "@/screens/Home";
import Login from "@/screens/Login";
import PrivateRoute from "@/contexts/auth/PrivateRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import FormsLayout from "@/screens/FormsLayout";
import SeguroIncendioScreen from "@/screens/SeguroIncendioScreen";
import SeguroFiancaEmpresarialMais2AnosScreen from "@/screens/SeguroFiancaEmpresarialMais2AnosScreen";
import SeguroFiancaEmpresarialMenos2AnosScreen from "@/screens/SeguroFiancaEmpresarialMenos2AnosScreen";
import SeguroFiancaResidencialScreen from "@/screens/SeguroFiancaResidencialScreen";


const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route path="/formulario" element={<FormsLayout />}>
            <Route path="seguro-incendio" element={<SeguroIncendioScreen />} />
            <Route
              path="seguro-fianca-empresarial-mais-2-anos"
              element={<SeguroFiancaEmpresarialMais2AnosScreen />}
            />
            <Route
              path="seguro-fianca-empresarial-menos-2-anos"
              element={<SeguroFiancaEmpresarialMenos2AnosScreen />}
            />
            <Route
              path="seguro-fianca-residencial"
              element={<SeguroFiancaResidencialScreen />}
            />
          </Route>
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
