import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core/';

const useStyle = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        textAlign: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%'
    },
    div_jitsi: {
        height: '0px',
        width: '0px'
    }
}));

const Conferences = (props) => {
    const classes = useStyle();

    const [jitsi, setJitsi] = useState(null)

    const domain = 'meet.jit.si';
    const options = {
        width: '100%',
        height: 'auto',
        configOverwrite: {
            disableDeepLinking: true
        },
    };

    useEffect(() => {
        if (window.JitsiMeetExternalAPI) {
            options.parentNode = document.getElementById('meet');
            // eslint-disable-next-line no-undef
            setJitsi(new JitsiMeetExternalAPI(domain, options));
            console.log("Success to connect Jitsi server");
        } else {
            setJitsi(null);
            console.log("Fail to connect Jitsi Server");
        }
    }, []);

    useEffect(() => {
        if(jitsi !== null) {
            getDevices();
        }
        
    }, [jitsi]);

    const sendMessage = () => {
        if(jitsi == null) {
            return
        }
        jitsi.executeCommand('displayName', 'John');
    }

    const getDevices = () => {
        
    }

    return(
        <div  className={classes.root}>
            <div id='meet' className={classes.div_jitsi}/>
            <div>
                <Button onClick={sendMessage} >Send Chat</Button>
            </div>
            
        </div>
    )
}

Conferences.prototype = {

}

export default Conferences