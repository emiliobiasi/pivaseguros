import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "@/screens/Login"
import PrivateRoute from "@/contexts/auth/PrivateRoute"
import { AuthProvider } from "@/contexts/auth/AuthContext"
import FormsLayout from "@/screens/FormsLayout"
import SeguroIncendioScreen from "@/screens/SeguroIncendioScreen"
import SeguroFiancaEmpresarialMais2AnosScreen from "@/screens/SeguroFiancaEmpresarialMais2AnosScreen"
import SeguroFiancaEmpresarialMenos2AnosScreen from "@/screens/SeguroFiancaEmpresarialMenos2AnosScreen"
import SeguroFiancaResidencialScreen from "@/screens/SeguroFiancaResidencialScreen"
import EfetivacaoSeguroFiancaScreen from "@/screens/EfetivoSeguroFiancaScreen"
import { SideBarLayout } from "@/screens/SideBarLayout"
import { DashboardIncendio } from "@/screens/DashboardIncendio"
import { DashboardIncendioComercial } from "@/screens/DashboardIncendioComercial"
import { DashboardFiancaResidencial } from "@/screens/DashboardFiancaResidencial"
import { DashboardFiancaEmpresarialMais2Anos } from "@/screens/DashboardFiancaEmpresarialMais2Anos"
import Home from "@/screens/Home"
import SeguroIncendioComercialScreen from "@/screens/SeguroIncendioComercialScreen"
import TituloCapitalizacaoScreen from "@/screens/TituloCapitalizacaoScreen"
import { DashboardTituloCapitalizacao } from "@/screens/DashboardTituloCapitalizacao"
import { DashboardEfetivacaoSeguroFianca } from "@/screens/DashboardEfetivacaoSeguroFianca"
import { DashboardFiancaEmpresarialMenos2Anos } from "@/screens/DashboardFiancaEmpresarialMenos2Anos"
import Graficos from "@/screens/Graficos"
import LoginImobiliarias from "@/screens/LoginImobiliarias"
import { AuthImobiliariaProvider } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias"
import PrivateRouteImobiliarias from "@/contexts/auth/imobiliarias/PrivateRouteImobiliarias"
import CadastrarImobiliarias from "@/screens/CadastrarImobiliarias"
import ResetPasswordForm from "@/screens/ResetPasswordForm"
import PainelAdmImobiliarias from "@/screens/PainelAdmImobiliarias"
import SeguradorasUploadPage from "@/screens/SeguradorasUploadPage"
import BoletoDownloadPage from "@/screens/BoletoDownloadPage"
import { BoletosProvider } from "@/contexts/boletos/boletos-context"
import ImobiliariaLayout from "@/screens/ImobiliariaLayout"
import BoletoDownloadHistoricoPage from "@/screens/BoletoDownloadHistoricoPage"
import HistoricoDeEnvioDeBoletos from "@/screens/HistoricoDeEnvioDeBoletos"
import ConfiguracoesDaConta from "@/screens/ConfiguracoesDaConta"
import CancelamentoSegurosScreen from "@/screens/CancelamentoSegurosScreen"
import ProtocoloCancelamentoSegurosPage from "@/screens/ProtocoloCancelamentosSeguroPage"
import { DashboardProtocoloCancelamentoSeguros } from "@/screens/DashboardProtocoloCancelamentoSeguros"
import AberturaSinistroScreen from "@/screens/AberturaSinistroScreen"
import ProtocoloAberturaSinistroPage from "@/screens/ProtocoloAberturaSinistroPage"
import { DashboardAberturaSinitro } from "@/screens/DashboardProtocoloAberturaSinistro"

const RoutesComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthImobiliariaProvider>
          <BoletosProvider>
            <Routes>
              <Route path="/entrar" element={<Login />} />
              <Route
                path="/imobiliaria/entrar"
                element={<LoginImobiliarias />}
              />
              <Route
                path="/esqueci-minha-senha"
                element={<ResetPasswordForm />}
              />
              <Route
                path="/imobiliaria"
                element={
                  <PrivateRouteImobiliarias>
                    <ImobiliariaLayout />
                  </PrivateRouteImobiliarias>
                }
              >
                <Route
                  path="download-boletos"
                  element={
                    <PrivateRouteImobiliarias>
                      <BoletoDownloadPage />
                    </PrivateRouteImobiliarias>
                  }
                />
                <Route
                  path="protocolo-cancelamento"
                  element={
                    <PrivateRouteImobiliarias>
                      <ProtocoloCancelamentoSegurosPage />
                    </PrivateRouteImobiliarias>
                  }
                />
                <Route
                  path="protocolo-abertura-sinistro"
                  element={
                    <PrivateRouteImobiliarias>
                      <ProtocoloAberturaSinistroPage />
                    </PrivateRouteImobiliarias>
                  }
                />
                <Route
                  path="configuracoes"
                  element={
                    <PrivateRouteImobiliarias>
                      <ConfiguracoesDaConta />
                    </PrivateRouteImobiliarias>
                  }
                />
                <Route
                  path="download-boletos/historico"
                  element={
                    <PrivateRouteImobiliarias>
                      <BoletoDownloadHistoricoPage />
                    </PrivateRouteImobiliarias>
                  }
                />
                <Route
                  path="formulario"
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
                  <Route
                    path="cancelamento-seguros"
                    element={
                      <PrivateRouteImobiliarias>
                        <CancelamentoSegurosScreen />
                      </PrivateRouteImobiliarias>
                    }
                  />
                  <Route
                    path="abertura-sinistro"
                    element={
                      <PrivateRouteImobiliarias>
                        <AberturaSinistroScreen />
                      </PrivateRouteImobiliarias>
                    }
                  />
                </Route>
              </Route>

              {/* INTERNO PIVA */}
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
                  path="dashboard-protocolo-cancelamento"
                  element={
                    <PrivateRoute>
                      <DashboardProtocoloCancelamentoSeguros />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="dashboard-protocolo-abertura-sinistro"
                  element={
                    <PrivateRoute>
                      <DashboardAberturaSinitro />
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
                <Route
                  path="painel-adm-imobiliarias"
                  element={
                    <PrivateRoute>
                      <PainelAdmImobiliarias />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="imobiliaria/cadastrar"
                  element={
                    <PrivateRoute>
                      <CadastrarImobiliarias />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="boletos-imobiliaria-upload"
                  element={
                    <PrivateRoute>
                      <SeguradorasUploadPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="historico-de-envio-de-boletos"
                  element={
                    <PrivateRoute>
                      <HistoricoDeEnvioDeBoletos />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
          </BoletosProvider>
        </AuthImobiliariaProvider>
      </AuthProvider>
    </Router>
  )
}

export default RoutesComponent
