import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    main_video: {
        height: '100%',
        width: 'calc(100%)',
        transform: 'scaleX(-1)',
        objectFit: 'conver'
    },
    div_video_list: {
        height: '-webkit-fill-available',
        margin: '20px',
        position: 'absolute',
        textAlign: 'center',
        right: 0,
    },
    tile_my_video: {
        transform: 'scaleX(-1)',
    },
    div_remote_videos: {
        marginTop: '30px',
    }
}));

const VideoNormalView = (props) => {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <video className={classes.main_video} autoPlay='1' id='localVideo' playsInline height=''/>
            <audio autoPlay='1' muted='1' id='localAudio' />
            <div className={classes.div_video_list} >
                <video className={classes.tile_my_video} autoPlay='1' id='localSmallVideo' playsInline height='150' />
                <div className={classes.div_remote_videos} id='#remoteVideos' />
             </div>
        </div>
    )
}

export default VideoNormalView;