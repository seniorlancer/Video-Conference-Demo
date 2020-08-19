import React, {useEffect, useState} from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';

const CreateRoom = (props) => {
    useEffect(() => {
        console.log("##################");
    }, []);

    return(
        <div>CreateRoom</div>
    );
}

CreateRoom.prototype = {

}

export default withRouter(CreateRoom);