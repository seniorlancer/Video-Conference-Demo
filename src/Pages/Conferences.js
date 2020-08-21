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
    
    let room = null;
    let isJoined = false;
    let connection = null;

    let localTracks = [];

    const remoteTracks = {};

    const options = {
        // serviceUrl:'wss://meet.jit.si/xmpp-websocket',
        hosts: {
            domain: 'meet.jit.si',
            muc: 'conference.meet.jit.si', // FIXME: use XEP-0030
            focus: 'focus.meet.jit.si',
        },
        bosh: 'https://meet.jit.si/http-bind', // FIXME: use xep-0156 for that
        clientNode: "https://jitsi.org/jitsimeet",
        // useStunTurn: true
    };

    const confOptions = {
        openBridgeChannel: true
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
            connection = new window.JitsiMeetJS.JitsiConnection(null, null, options);

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
        console.log('############################');
        var roomName = 'conference';
        
        room = connection.initJitsiConference('conference', confOptions);

        room.on(window.JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(window.JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
            console.log(`track removed!!!${track}`);
        });

        room.on(window.JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(window.JitsiMeetJS.events.conference.USER_JOINED, id => {
            console.log('user join');
            remoteTracks[id] = [];
        });

        room.on(window.JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
        room.on(window.JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
            console.log(`${track.getType()} - ${track.isMuted()}`);
        });
        room.on(window.JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => console.log(`${userID} - ${displayName}`));
        room.on(window.JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
        room.on(window.JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,() => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));

        room.join();
    }

    const onConnectionFailed = () => {
        console.error('Connection Failed!');
    }

    const disconnect = () => {
        console.log('disconnect!');
        connection.removeEventListener(window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
        connection.removeEventListener(window.JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
        connection.removeEventListener(window.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);
    }

    function onRemoteTrack(track) {
        if (track.isLocal()) {
            return;
        }
        const participant = track.getParticipantId();
    
        if (!remoteTracks[participant]) {
            remoteTracks[participant] = [];
        }
        const idx = remoteTracks[participant].push(track);
    
        track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
        track.addEventListener(window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('remote track muted'));
        track.addEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('remote track stoped'));
        track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        const id = participant + track.getType() + idx;
    
        if (track.getType() === 'video') {
            $('body').append(
                `<video autoplay='1' id='${participant}video${idx}' />`);
        } else {
            $('body').append(
                `<audio autoplay='1' id='${participant}audio${idx}' />`);
        }
        track.attach($(`#${id}`)[0]);
    }

    function onConferenceJoined() {
        isJoined = true;
        for (let i = 0; i < localTracks.length; i++) {
            room.addTrack(localTracks[i]);
        }
    }

    function onUserLeft(id) {
        console.log('user left');
        if (!remoteTracks[id]) {
            return;
        }
        const tracks = remoteTracks[id];
    
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].detach($(`#${id}${tracks[i].getType()}`));
        }
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