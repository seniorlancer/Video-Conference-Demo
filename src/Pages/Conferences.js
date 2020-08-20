import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core/';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import * as $ from 'jquery';

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
    const [devices, setDevices] = useState(null);

    const domain = 'meet.jit.si';
    
    const options = {
        hosts: {
            domain: 'https://beta.meet.jit.si',
            muc: 'beta.meet.jit.si', // FIXME: use XEP-0030
        },
        bosh: '//beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that
    
        // The name of client node advertised in XEP-0115 'c' stanza
        clientNode: 'https://beta.meet.jit.si',
    };

    useEffect(() => {
        if(window.JitsiMeetJS) {
            window.JitsiMeetJS.init();
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                console.log("enumerateDevices() not supported.");
                return;
            }

            window.$ = $
            window.jQuery = $

            var connection = new window.JitsiMeetJS.JitsiConnection(null, null, options);

            connection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            connection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
            connection.addEventListener(window.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

            connection.connect();

            // window.JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
            //     setDevices(devices);
            // });
            
        }
    }, []);

    useEffect(() => {
        if(devices == null) 
            return
        
        

        const options = {
            roomName: 'roomName',
            width: '100%',
            height: 'auto',
            configOverwrite: {
                disableDeepLinking: true
            },
        };

        if (window.JitsiMeetExternalAPI) {
            options.parentNode = document.getElementById('meet');
            // eslint-disable-next-line no-undef
            // setJitsi(new JitsiMeetExternalAPI(domain, options));
            console.log("Success to connect Jitsi server");
        } else {
            setJitsi(null);
            console.log("Fail to connect Jitsi Server");
        }
    }, [devices]);

    const onConnectionSuccess = () => {
        console.log('connected');
    }

    const onConnectionFailed = () => {
        console.log('fail');
    }

    const disconnect = () => {
        console.log('disconnect');
    }

    return(
        <div  className={classes.root}>
            <div id='meet' className={classes.div_jitsi}/>
            <div>
                <Button >Send Chat</Button>
            </div>
            
        </div>
    )
}

Conferences.prototype = {

}

export default withRouter(Conferences);