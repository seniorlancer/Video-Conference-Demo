import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VideoSmallView from './VideoSmallView';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    main_video: {
        height: '100%',
        width: '100%',
        // transform: 'scaleX(-1)',
        objectFit: 'cover'
    },
    div_video_list: {
        height: '-webkit-fill-available',
        margin: '20px',
        position: 'absolute',
        textAlign: 'center',
        right: 0,
    },
    div_remote_videos: {
        width: '100%',
        height: 'calc(100% - 180px)',
        marginTop: '30px',
        overflowY: 'scroll',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        
    },
}));

const VideoNormalView = (props) => {
    const {localVideoTrack} = props;
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <video className={classes.main_video} autoPlay='1' id='mainVideo' playsInline onSuspend={()=>props.handleRemoveMainVideo()}/>
            <audio autoPlay='1' muted='1' id='mainAudio' />
            <div className={classes.div_video_list} >
                <div id='divLocalSmallVideo' />
                <audio autoPlay='1' muted='1' id='localSmallAudio' />
                <div className={classes.div_remote_videos} id='remoteVideos'></div>
             </div>
        </div>
    )
}

export default VideoNormalView;