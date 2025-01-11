//# Componentes //
import CustomLink from '../Componentes Globais/Miscellaneous/CustomLink';
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão';
import ChangeTheme from '../Componentes Globais/Theme/ChangeTheme.js';
//# Icons //
import { BsHousesFill } from 'react-icons/bs';
import { BsListUl } from 'react-icons/bs';
import { BsFolderPlus } from 'react-icons/bs';
import { FaChartPie } from 'react-icons/fa';
//# Classes //
import './MenuLateral.scss'
/*--------------*/

/* 
 # ESTRUTURA OBJETO "ROUTES"

  .. "NomeRota": {
    , rota: "Rota Encaminhada",
    , texto: "Nome Do Link",
    , className: "Classe Aplicada Ao Link",
    , OPCIONAL; icon: "Icone Aplicado Ao Link"
    , OPCIONAL; hover: " Classe Aplicada Ao Evento Hover Do Link"
    , OPCIONAL; focus: " Classe Aplicada Ao Evento Focus Do Link"
  .. }
*/
const Routes = {
  Home: {
    rota: '/',
    texto: 'Home',
    className: 'menu-lateral__link-home',
    Icon: <BsHousesFill className='menu-lateral__icon' />
  },
  Inclusao: {
    produtos: {
      rota: '/inclusao/produtos',
      texto: 'Produtos',
      className: 'menu-lateral__link',
      Icon: <BsFolderPlus className='menu-lateral__icon' />
    },
    vendas: {
      rota: '/inclusao/vendas',
      texto: 'Vendas',
      className: 'menu-lateral__link',
      Icon: <BsFolderPlus className='menu-lateral__icon' />
    }
  },
  Manutenção: {
    vendas: {
      rota: '/manut/vendas',
      texto: 'Vendas',
      className: 'menu-lateral__link',
      Icon: <BsListUl className='menu-lateral__icon' />
    },
    produtos: {
      rota: '/manut/produtos',
      texto: 'Produtos',
      className: 'menu-lateral__link',
      Icon: <BsListUl className='menu-lateral__icon' />
    }
  },
  DashBoard: {
    GeralDashBoard: {
      rota: 'dashboard/geral',
      texto: 'Geral',
      className: 'menu-lateral__link',
      Icon: <FaChartPie className='menu-lateral__icon' />
    }
  }
}

export default function MenuLateral() {
  return (
    <>
      { // .. Menu-Lateral //
      }
      <nav className='menu-lateral'>
        {// .. Lista //
        }
        <ul className='menu-lateral__lista'>
          {// .. Home //
          }
          <li className={`menu-lateral__item menu-lateral__item--home`}
          >
            <CustomLink
              Rota={Routes.Home.rota}
              texto={Routes.Home.texto}
              className={Routes.Home.className}
              Icon={Routes.Home.Icon}
            />
          </li>
          {// .. Inclusao //
          }
          <li className='menu-lateral__item'>
            <Txt type='h1' texto={'INCLUSÃO'} className='menu-lateral__item-txt' />
            <ul className='menu-lateral__sub-lista'>
              <li className='menu-lateral__sub-item'>
                <CustomLink
                  Rota={Routes.Inclusao.produtos.rota}
                  texto={Routes.Inclusao.produtos.texto}
                  className={Routes.Inclusao.produtos.className}
                  Icon={Routes.Inclusao.produtos.Icon}
                  hover={true}
                  focus={true}
                />
              </li>
              <li className='menu-lateral__sub-item'>
                <CustomLink
                  Rota={Routes.Inclusao.vendas.rota}
                  texto={Routes.Inclusao.vendas.texto}
                  className={Routes.Inclusao.vendas.className}
                  Icon={Routes.Inclusao.vendas.Icon}
                  hover={true}
                  focus={true}
                />
              </li>
            </ul>
          </li>
          {// .. Manutenção //
          }
          <li className='menu-lateral__item'>
            <Txt type='h1' texto={'MANUTENÇÃO'} className='menu-lateral__item-txt' />
            <ul className='menu-lateral__sub-lista'>
              <li className='menu-lateral__sub-item'>
                <CustomLink
                  Rota={Routes.Manutenção.produtos.rota}
                  texto={Routes.Manutenção.produtos.texto}
                  className={Routes.Manutenção.produtos.className}
                  Icon={Routes.Manutenção.produtos.Icon}
                  hover={true}
                  focus={true}
                />
              </li>
              <li className='menu-lateral__sub-item'>
                <CustomLink
                  Rota={Routes.Manutenção.vendas.rota}
                  texto={Routes.Manutenção.vendas.texto}
                  className={Routes.Manutenção.vendas.className}
                  Icon={Routes.Manutenção.vendas.Icon}
                  hover={true}
                  focus={true}
                />
              </li>
            </ul>
          </li>
          {// .. DashBoard //
          }
          <li className='menu-lateral__item'>
            <Txt type='h1' texto={'DASHBOARD'} className='menu-lateral__item-txt' />
            <ul className='menu-lateral__sub-lista'>
              <li className='menu-lateral__sub-item'>
                <CustomLink
                  Rota={Routes.DashBoard.GeralDashBoard.rota}
                  texto={Routes.DashBoard.GeralDashBoard.texto}
                  className={Routes.DashBoard.GeralDashBoard.className}
                  Icon={Routes.DashBoard.GeralDashBoard.Icon}
                  hover={true}
                  focus={true}
                />
              </li>
            </ul>
          </li >
          {// .. changeTheme //
          }
          <li className='menu-lateral__item menu-lateral__item--changeTheme'>
            <ChangeTheme />
          </li >
          {/*--------------*/}
        </ul >
        {/*--------------*/}
      </nav >
    </>

  );
}
