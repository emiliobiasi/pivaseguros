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
import { AuthImobiliariaProvider } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias";
import PrivateRouteImobiliarias from "@/contexts/auth/imobiliarias/PrivateRouteImobiliarias";
import CadastrarImobiliarias from "@/screens/CadastrarImobiliarias";
import ResetPasswordForm from "@/screens/ResetPasswordForm";

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthImobiliariaProvider>
          <Routes>
            <Route path="/entrar" element={<Login />} />
            <Route
              path="/imobiliarias/entrar"
              element={<LoginImobiliarias />}
            />
            <Route
              path="/esqueci-minha-senha"
              element={<ResetPasswordForm />}
            />
            <Route
              path="imobiliarias/cadastrar"
              element={<CadastrarImobiliarias />}
            />
            <Route
              path="/formulario"
              element={
                <PrivateRouteImobiliarias>
                  <FormsLayout />
                </PrivateRouteImobiliarias>
              }
            >
              <Route
                path="seguro-incendio"
                element={
                  <PrivateRouteImobiliarias>
                    <SeguroIncendioScreen />
                  </PrivateRouteImobiliarias>
                }
              />
              <Route
                path="seguro-incendio-comercial"
                element={
                  <PrivateRouteImobiliarias>
                    <SeguroIncendioComercialScreen />
                  </PrivateRouteImobiliarias>
                }
              />
              <Route
                path="seguro-fianca-empresarial-mais-2-anos"
                element={
                  <PrivateRouteImobiliarias>
                    <SeguroFiancaEmpresarialMais2AnosScreen />
                  </PrivateRouteImobiliarias>
                }
              />
              <Route
                path="seguro-fianca-empresarial-menos-2-anos"
                element={
                  <PrivateRouteImobiliarias>
                    <SeguroFiancaEmpresarialMenos2AnosScreen />
                  </PrivateRouteImobiliarias>
                }
              />
              <Route
                path="seguro-fianca-residencial"
                element={<SeguroFiancaResidencialScreen />}
              />
              <Route
                path="efetivacao-seguro-fianca"
                element={
                  <PrivateRouteImobiliarias>
                    <EfetivacaoSeguroFiancaScreen />
                  </PrivateRouteImobiliarias>
                }
              />
              <Route
                path="titulo-capitalizacao"
                element={
                  <PrivateRouteImobiliarias>
                    <TituloCapitalizacaoScreen />
                  </PrivateRouteImobiliarias>
                }
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
