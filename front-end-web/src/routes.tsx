import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';


const Routes = () => {
      return (
          <BrowserRouter>
                <Route  path="/" component={Home} exact/>
                <Route path="/createpoint" component={CreatePoint} />
          </BrowserRouter>
      )
}

export default Routes;