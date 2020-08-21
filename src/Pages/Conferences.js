import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button} from '@material-ui/core/';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import * as $ from 'jquery';
import ControlArea from '../Components/ControlArea';

const useStyle = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        background: '#1d1d1d',
        width: '100%',
        height: '100%',
        
    },
    control_area: {
        width: '100%',
        height: '50px',
        bottom: 0,
        position: 'absolute',
        marginBottom: '50px',
        display: 'flex',
        justifyContent: 'center'
    }
}));

const Conferences = (props) => {
    const classes = useStyle();
    
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
        useStunTurn: true
    };

    const confOptions = {
        openBridgeChannel: true
    };

    const initOptions = {
        enableAnalyticsLogging: false
    }

    useEffect(() => {
        if(window.JitsiMeetJS) {
            window.JitsiMeetJS.init(initOptions);
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

            

            window.JitsiMeetJS.createLocalTracks({devices: ['audio', 'video']})
                .then(onLocalTracks)
                .catch(error=> {
                    console.log(error)
            });
            // window.JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
            //     setDevices(devices);
            // });
            
        }
    }, []);

    const onConnectionSuccess = () => {
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

    const onLocalTracks = (tracks) => {
        localTracks = tracks
        localTracks.map((localTrack, index) => {
            localTrack.addEventListener(
                window.JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
                audioLevel => console.log(`Audio Level local: ${audioLevel}`));
            localTrack.addEventListener(
                window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => console.log('local track muted'));
            localTrack.addEventListener(
                window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                () => console.log('local track stoped'));
            localTrack.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
                deviceId =>
                    console.log(`track audio output device was changed to ${deviceId}`));
            if (localTrack.getType() === 'video') {
                document.getElementsByTagName('body').append(`<video autoplay='1' id='localVideo${index}' />`);
                localTrack.attach($(`#localVideo${index}`)[0]);
            } else {
                document.getElementsByTagName('body').append(
                    `<audio autoplay='1' muted='true' id='localAudio${index}' />`);
                localTrack.attach($(`#localAudio${index}`)[0]);
            }
            if (isJoined) {
                room.addTrack(localTrack);
            }
        })
    }

    function onRemoteTrack(track) {
        if (track.isLocal()) {
            return;
        }
        console.log('=============');
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
            <div className={classes.control_area}>
                <ControlArea />
            </div>
            
        </div>
    )
}

Conferences.prototype = {

}

export default withRouter(Conferences);