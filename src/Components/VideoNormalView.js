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
        height: '100%',
        width: '400px',
        position: 'absolute',
        right: 0
    }
}));

const VideoNormalView = (props) => {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <video className={classes.main_video} autoPlay='1' id='localVideo' playsInline/>
            <audio autoPlay='1' muted='1' id='localAudio' />
            <div className={classes.div_video_list} />
        </div>
    )
}

export default VideoNormalView;