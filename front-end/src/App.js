//# Componentes //
//, Manut //
import MainManut from './components/Rota Manutenção/MainManut'
import Manutencao from "./components/Rota Manutenção/Manutencao"
//, Inclusao //
import MainInclusao from './components/Rota Inclusão/MainInclusao'
import InputProdutos from "./components/Rota Inclusão/InputProdutos"
import InputVendas from "./components/Rota Inclusão/InputVendas"
//, Dados //
import MainDashBoard from "./components/Rota DashBoard/MainDshB"
import GeralDashBoard from "./components/Rota DashBoard/Geral/GeralDshB"
//, Home //
import MainHome from './components/Rota Home/MainHome'
import Home from "./components/Rota Home/Home"
//, MenuLateral //
import MenuLateral from "./components/Menu Lateral/MenuLateral"
//# Libs, Framework //
import { Routes, Route } from 'react-router-dom'
import { useContext, useEffect } from 'react'
//# Helpers //
import { frmt } from './helpers/js/FormatClasses';
//# Context //
import cntxt_usr_cnfg from './config/usr_cnfg/context/cntxt_usr_cnfg'
//# Classes //
import './App.scss'
/*--------------*/

function Header({ usr_cnfg }) {
  return (
    <>
      <header
        className='header'
        bg_theme={usr_cnfg.bg_theme}
      >
        <MenuLateral />
      </header>
    </>
  )
}
function Main({ usr_cnfg }) {
  function Route_Home() {
    return (
      <Route path='/' element={<MainHome />}>
        <Route path='' element={<Home />} />
      </Route>
    )
  }
  function Route_Inclusao() {
    return (
      <Route path='inclusao' element={<MainInclusao />}>
        <Route path='produtos' element={<InputProdutos />} />
        <Route path='vendas' element={<InputVendas />} />
      </Route>
    )
  }
  function Route_Manutencao() {
    return (
      <Route path='manut' element={<MainManut />}>
        <Route path='produtos' element={<Manutencao Lista={'produtos'} />} />
        <Route path='vendas' element={<Manutencao Lista={'vendas'} />} />
      </Route>
    )
  }
  function Route_DashBoard() {
    return (
      <Route path='dashboard' element={<MainDashBoard />}>
        <Route path='geral' element={<GeralDashBoard />} />
      </Route>
    )
  }

  return (
    <>
      <main
        className={frmt(`main`)}
        bg_theme={usr_cnfg.bg_theme}
      >
        <Routes>
          {Route_Home()}
          {Route_Inclusao()}
          {Route_Manutencao()}
          {Route_DashBoard()}
        </Routes>
        {/*--------------*/}
      </main >
    </>
  )
}
export default function App() {
  const { local_ini, usr_cnfg } = useContext(cntxt_usr_cnfg)

  useEffect(() => {
    local_ini()
  }, [])

  return (
    <>
      <Header usr_cnfg={usr_cnfg} />
      <Main usr_cnfg={usr_cnfg} />
    </>
  );
}


