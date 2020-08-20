import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {
    CreateRoom as CreateRoom,
    Conferences as Conferences
} from './Pages'

const Routes = () => {
    return(
        <Switch>
            {/* <Redirect
                exact
                from="/"
                to="/createroom"
            />  */}
            <Route exact path="/" component={CreateRoom} />
            <Route exact path="/conferences" component={Conferences} />
        </Switch>
    )
}

export default Routes;