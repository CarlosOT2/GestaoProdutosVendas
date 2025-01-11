//# Componentes //
import App from './App';
//# Libs, Frameworks //
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
//# Context Provider //
import { Provider_usr_cnfg } from './config/usr_cnfg/context/cntxt_usr_cnfg'



/*--------------*/

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider_usr_cnfg>
        <App />
      </Provider_usr_cnfg>
    </React.StrictMode>
  </BrowserRouter>
);

