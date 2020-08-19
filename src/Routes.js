import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {
    CreateRoom as CreateRoom,
    Conferences as Conferences
} from './Pages'

const Routes = () => {
    return(
        <Switch>
            <Redirect
                exact
                from="/"
                to="/createroom"
            /> 
            <Route path="/createroom" exact><CreateRoom /></Route>
            <Route path="/conferences" exact><Conferences /></Route>
        </Switch>
    )
}

export default Routes;