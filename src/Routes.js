import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {CreateRoom as CreateRoom} from './Pages'

const Routes = () => {
    return(
        <Switch>
            <Redirect
                exact
                from="/"
                to="/createroom"
            /> 
            <Route path="/createroom" exact><CreateRoom /></Route>
        </Switch>
    )
}

export default Routes;