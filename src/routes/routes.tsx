import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/screens/Login";
import PrivateRoute from "@/contexts/auth/PrivateRoute";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import FormsLayout from "@/screens/FormsLayout";
import SeguroIncendioScreen from "@/screens/SeguroIncendioScreen";
import SeguroFiancaEmpresarialMais2AnosScreen from "@/screens/SeguroFiancaEmpresarialMais2AnosScreen";
import SeguroFiancaEmpresarialMenos2AnosScreen from "@/screens/SeguroFiancaEmpresarialMenos2AnosScreen";
import SeguroFiancaResidencialScreen from "@/screens/SeguroFiancaResidencialScreen";
import EfetivacaoSeguroFiancaScreen from "@/screens/EfetivoSeguroFiancaScreen";
import { SideBarLayout } from "@/screens/SideBarLayout";
import { DashboardIncendio } from "@/screens/DashboardIncendio";
import { DashboardIncendioComercial } from "@/screens/DashboardIncendioComercial";
import { DashboardFiancaResidencial } from "@/screens/DashboardFiancaResidencial";
import { DashboardFiancaEmpresarialMais2Anos } from "@/screens/DashboardFiancaEmpresarialMais2Anos";
import Home from "@/screens/Home";
import SeguroIncendioComercialScreen from "@/screens/SeguroIncendioComercialScreen";
import TituloCapitalizacaoScreen from "@/screens/TituloCapitalizacaoScreen";
import { DashboardTituloCapitalizacao } from "@/screens/DashboardTituloCapitalizacao";
import { DashboardEfetivacaoSeguroFianca } from "@/screens/DashboardEfetivacaoSeguroFianca";
import { DashboardFiancaEmpresarialMenos2Anos } from "@/screens/DashboardFiancaEmpresarialMenos2Anos";
import Graficos from "@/screens/Graficos";
import LoginImobiliarias from "@/screens/LoginImobiliarias";
import { AuthImobiliariaProvider } from "@/contexts/auth/imobiliarias/AuthContextImobiliárias";

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthImobiliariaProvider>
          <Routes>
            <Route path="/entrar" element={<Login />} />
            <Route path="imobiliarias/entrar" element={<LoginImobiliarias />} />
            <Route path="/formulario" element={<FormsLayout />}>
              <Route
                path="seguro-incendio"
                element={<SeguroIncendioScreen />}
              />
              <Route
                path="seguro-incendio-comercial"
                element={<SeguroIncendioComercialScreen />}
              />
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
                path="efetivacao-seguro-fianca"
                element={<EfetivacaoSeguroFiancaScreen />}
              />
              <Route
                path="titulo-capitalizacao"
                element={<TituloCapitalizacaoScreen />}
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
                path="graficos"
                element={
                  <PrivateRoute>
                    <Graficos />
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
              <Route
                path="dashboard-fianca-empresarial-mais-2-anos"
                element={
                  <PrivateRoute>
                    <DashboardFiancaEmpresarialMais2Anos />
                  </PrivateRoute>
                }
              />
              <Route
                path="dashboard-fianca-empresarial-menos-2-anos"
                element={
                  <PrivateRoute>
                    <DashboardFiancaEmpresarialMenos2Anos />
                  </PrivateRoute>
                }
              />
              <Route
                path="dashboard-titulo-capitalizacao"
                element={
                  <PrivateRoute>
                    <DashboardTituloCapitalizacao />
                  </PrivateRoute>
                }
              />
              <Route
                path="dashboard-efetivacao-seguro-fianca"
                element={
                  <PrivateRoute>
                    <DashboardEfetivacaoSeguroFianca />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </AuthImobiliariaProvider>
      </AuthProvider>
    </Router>
  );
};

export default RoutesComponent;
