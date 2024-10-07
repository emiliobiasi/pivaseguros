import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/screens/Login";
import PrivateRoute from "@/contexts/auth/PrivateRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import FormsLayout from "@/screens/FormsLayout";
import SeguroIncendioScreen from "@/screens/SeguroIncendioScreen";
import SeguroFiancaEmpresarialMais2AnosScreen from "@/screens/SeguroFiancaEmpresarialMais2AnosScreen";
import SeguroFiancaEmpresarialMenos2AnosScreen from "@/screens/SeguroFiancaEmpresarialMenos2AnosScreen";
import SeguroFiancaResidencialScreen from "@/screens/SeguroFiancaResidencialScreen";
import SeguroFiancaScreen from "@/screens/SeguroFiancaScreen";
import { SideBarLayout } from "@/screens/SideBarLayout";
import { DashboardIncendio } from "@/screens/DashboardIncendio";
import { DashboardIncendioComercial } from "@/screens/DashboardIncendioComercial";
import { DashboardFiancaResidencial } from "@/screens/DashboardFiancaResidencial";
import Home from "@/screens/Home";
import SeguroIncendioComercialScreen from "@/screens/SeguroIncendioComercialScreen";

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/entrar" element={<Login />} />
          <Route path="/formulario" element={<FormsLayout />}>
            <Route path="seguro-incendio" element={<SeguroIncendioScreen />} />
            <Route path="seguro-incendio-comercial" element={<SeguroIncendioComercialScreen />} />
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
            <Route
              path="seguro-fianca"
              element={<SeguroFiancaScreen />}
            />
          </Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <SideBarLayout />
              </PrivateRoute>
            }
          >
            <Route
              path="inicio"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard-incendio"
              element={
                <PrivateRoute>
                  <DashboardIncendio />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard-incendio-comercial"
              element={
                <PrivateRoute>
                  <DashboardIncendioComercial />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard-fianca-residencial"
              element={
                <PrivateRoute>
                  <DashboardFiancaResidencial />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default RoutesComponent;
