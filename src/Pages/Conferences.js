import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Drawer} from '@material-ui/core/';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import * as $ from 'jquery';
import ControlArea from '../Components/ControlArea';
import VideoNormalView from '../Components/VideoNormalView';
import VideoSmallView from '../Components/RemoteSmallView/VideoSmallView';
import './conference.css';

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
        bottom: 0,
        position: 'absolute',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center'
    },
    show_chat: {
        width: '400px',
        height: '100%',
        position: 'absolute',
        left: 0,
        visibility: 'visible',
        transition: '0.6s',
        background: '#FFFFFF'
    },
    hide_chat: {
        width: '400px',
        height: '100%',
        position: 'absolute',
        left: '-100%',
        visibility: 'hide',
        transition: '0.6s',
        background: '#FFFFFF'
    },
    video_area: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    }
}));

const Conferences = (props) => {
    const classes = useStyle();
    const [showChat, setShowChat] = useState(false);
    const listRemoteUserData = [];
    const [remoteUserData, setRemoteUserData] = useState([]);
    const [localVideoTrack, setLocalVideoTrack] = useState([]);
    const [localAudioTrack, setLocalAudioTrack] = useState([]);
    const [raiseHand, setRaiseHand] = useState(false);
    const isScreenShare = React.useRef(false);
    const isCamera = React.useRef(false);
    const room = React.useRef(null);
    let localTracks = [];
    // let room = React.useRef(null);
    let isJoined = false;
    let connection = null;
    let remoteTracks = {};
    let isVideo = false;

    const options = {
        // serviceUrl:'wss://meet.jit.si/xmpp-websocket',
        hosts: {
            domain: 'beta.meet.jit.si',
            muc: 'conference.beta.meet.jit.si', // FIXME: use XEP-0030
            // focus: 'focus.meet.jit.si',
        },
        bosh: 'https://beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that
        clientNode: "https://beta.jitsi.org/jitsimeet",
        // useStunTurn: true
    };

    const confOptions = {
        openBridgeChannel: true,
    };

    const initOptions = {
        disableAudioLevels: true,
        enableAnalyticsLogging: false
    }

    useEffect(() => {
        if(window.JitsiMeetJS) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                console.log("enumerateDevices() not supported.");
                return;
            }

            window.$ = $
            window.jQuery = $
            window.JitsiMeetJS.init(initOptions);
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
        }
    }, []);

    const onConnectionSuccess = () => {        
        room.current = connection.initJitsiConference('conference1234', confOptions);
        room.current.on(window.JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
        room.current.on(window.JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoveTrack);
        room.current.on(window.JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, onChangeName);
        room.current.on(window.JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.current.on(window.JitsiMeetJS.events.conference.USER_JOINED, (id, user) => {
            let isFind = false
            listRemoteUserData.map((userData, index) => {
                if(userData.id === id) {
                    listRemoteUserData[index].user = user;
                }
                setRemoteUserData([]);
                setRemoteUserData(listRemoteUserData);
                isFind = true;
            });
            if(isFind === true) {
                return;
            }
            let user_val = {id: id, user: user, isHand: false, videotrack: [], audiotrack: []};
            listRemoteUserData.push(user_val);
            setRemoteUserData([]);
            setRemoteUserData(listRemoteUserData);
        });
        room.current.on(window.JitsiMeetJS.events.conference.PARTICIPANT_PROPERTY_CHANGED, handleParticipantPropertyChange);
        room.current.on(window.JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
        room.current.on(window.JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
            console.log(`${track.getType()} - ${track.isMuted()}`);
        });
        room.current.on(window.JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => console.log(`${userID} - ${displayName}`));
        room.current.on(window.JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
        room.current.on(window.JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,() => console.log(`${room.current.getPhoneNumber()} - ${room.current.getPhonePin()}`));
        room.current.setDisplayName('Hello Hi');

        room.current.join();
    }

    const onConnectionFailed = (error) => {
        console.error('Connection Failed!-' +  error);
    }

    const disconnect = () => {
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
                localTrack.attach($(`#mainVideo`)[0]);
                setLocalVideoTrack(localTrack);
            } else {
                localTrack.attach($(`#mainAudio`)[0]);
                localTrack.attach($(`#localSmallAudio`)[0]);
                setLocalAudioTrack(localTrack);
            }
            if (isJoined) {
                room.current.addTrack(localTrack);
            }
        })
    }

    const onRemoteTrack = (track) => {
        if (track.isLocal()) {
            return;
        }

        let isFind = false;
        const participant = track.getParticipantId();
        const type = track.getType();
        listRemoteUserData.map((remoteUser, index) => {
            if(remoteUser.id === participant) {
                if(type === 'video') {
                    remoteUser.videotrack = track;
                    listRemoteUserData[index] = remoteUser;
                } else if(type === 'audio') {
                    remoteUser.audiotrack = track;
                    listRemoteUserData[index] = remoteUser;
                }
                setRemoteUserData([]);
                setRemoteUserData(listRemoteUserData);
                isFind = true;
            }
        });
        if(isFind === true) {
            return;
        }
        let user_val = {id: participant, user: '', isHand: false, videotrack: [], audiotrack: []};
        if(type === 'video') {
            user_val.videotrack = track;
        } else if(type === 'audio') {
            user_val.audiotrack = track;
        }
        listRemoteUserData.push(user_val);
        setRemoteUserData([]);
        setRemoteUserData(listRemoteUserData);
        return;
    }

    const onRemoveTrack = (track) => {
        const participant = track.getParticipantId();

        listRemoteUserData.map((user, index) => {
            if(user.id === participant) {
                listRemoteUserData.splice(index);
            }
        });
        setRemoteUserData([]);
        setRemoteUserData(listRemoteUserData);
    }
    
    const onChangeName = (value) => {

    }

    function onConferenceJoined() {
        isJoined = true;
        localTracks.map((localTrack) => {
            room.current.addTrack(localTrack);
            room.current.setDisplayName('Hello Hi');
        });
    }

    function onUserLeft(id) {
        console.log('1111111111' + id);
        if (!remoteTracks[id]) {
            return;
        }
        const tracks = remoteTracks[id];
    
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].detach($(`#${id}${tracks[i].getType()}`));
        }
    }

    const handleParticipantPropertyChange = (participant, propertyName, oldValue, newValue) => {
        let userData = [];
        listRemoteUserData.map((remoteUser, index)=>{
            if(remoteUser.id === participant.getId()) {
                switch(propertyName) {
                    case "raised-hand":
                        listRemoteUserData[index].isHand = newValue;
                        break;
                    default:
                        break;
                }
            }
            userData.push(remoteUser);
        });
        setRemoteUserData([]);
        setRemoteUserData(listRemoteUserData);
    }
    
    const handleClickChat = () => {
        setShowChat(!showChat);
    }

    const handleClickCamera = () => {
        if(localVideoTrack.isMuted()) {
            localVideoTrack.unmute();
        } else {
            localVideoTrack.mute();
        }
    }

    const handleClickMic = () => {
        if(localAudioTrack.isMuted()) {
            localAudioTrack.unmute();
        } else {
            localAudioTrack.mute();
        }
    }

    useEffect(() => {
        if(!isScreenShare.current && !isCamera.current) {
            return;
        }

        localVideoTrack.addEventListener(
            window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('local track muted'));
        if(isScreenShare.current) {
            localVideoTrack.addEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, showCamera);
        }
        localVideoTrack.attach($(`#mainVideo`)[0]);
        localVideoTrack.attach($(`#localSmallVideo`)[0]);
        room.current.addTrack(localVideoTrack);
        isScreenShare.current = false;
        isCamera.current = false;
    }, [localVideoTrack]);

    const showCamera = () => {
        isCamera.current = true;
        window.JitsiMeetJS.createLocalTracks({
            devices: ['video']
        })
        .then(async tracks => {
            if(localVideoTrack) {
                await localVideoTrack.dispose();
            }
            setLocalVideoTrack(tracks[0]);
        })
        .catch(error => console.log(error));
    } 

    const handleClickScreenShare = () => {
        isScreenShare.current = true;

        window.JitsiMeetJS.createLocalTracks({
            devices: ['desktop']
        })
        .then(async tracks => {
            if(localVideoTrack) {
                await localVideoTrack.dispose();
            }
            setLocalVideoTrack(tracks[0]);
        })
        .catch(error => console.log(error));
    }

    const handleClickHand = () => {
        room.current.setLocalParticipantProperty("raised-hand", !raiseHand);
        setRaiseHand(!raiseHand);
    }

    const handleRemoveMainVideo = async () => {
        if(localVideoTrack.length !== 0) {
            localVideoTrack.attach($(`#mainVideo`)[0]);
        } else {
            
        }
    }

    return(
        <div  className={classes.root}>
            <div className={classes.video_area}>
                <VideoNormalView localVideoTrack={localVideoTrack} remoteUsers={remoteUserData} isLocalHand={raiseHand} handleRemoveMainVideo={handleRemoveMainVideo}/>
            </div>
            <div className={classes.control_area}>
                <ControlArea onClickChat={handleClickChat} onClickCamera={handleClickCamera} onClickMic={handleClickMic} onClickScreenShare={handleClickScreenShare} onClickHand={handleClickHand}/>
            </div>
            {
                showChat ? <div className={classes.show_chat}>Hello What are you doing?</div> : 
                            <div className={classes.hide_chat}>Hello What are you doing?</div>
            }
        </div>
    )
}

Conferences.prototype = {

}

export default withRouter(Conferences);