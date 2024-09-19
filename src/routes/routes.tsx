import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "@/screens/About";
import Home from "@/screens/Home";
import Login from "@/screens/Login";
import PrivateRoute from "@/contexts/auth/PrivateRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import FormsLayout from "@/screens/FormsLayout";
import SeguroIncendioForms from "@/screens/SeguroIncendioForms";
import SeguroFiancaEmpresarialMais2AnosForms from "@/screens/SeguroFiancaEmpresarialMais2AnosForms";
import SeguroFiancaEmpresarialMenos2AnosForms from "@/screens/SeguroFiancaEmpresarialMenos2AnosForms";
import SeguroFiancaResidencialForms from "@/screens/SeguroFiancaResidencialForms";

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route path="/formulario" element={<FormsLayout />}>
            <Route path="seguro-incendio" element={<SeguroIncendioForms />} />
            <Route
              path="seguro-fianca-empresarial-mais-2-anos"
              element={<SeguroFiancaEmpresarialMais2AnosForms />}
            />
            <Route
              path="seguro-fianca-empresarial-menos-2-anos"
              element={<SeguroFiancaEmpresarialMenos2AnosForms />}
            />
            <Route
              path="seguro-fianca-residencial"
              element={<SeguroFiancaResidencialForms />}
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
