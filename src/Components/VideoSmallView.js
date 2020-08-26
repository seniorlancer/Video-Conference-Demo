import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as $ from 'jquery';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        background: '#000000'
    },
    over_div_show: {
        position: 'absolute',
        width: '200px',
        height: '150px',
        background: '#000000A0',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    over_div_hide: {
        display: 'none'
    }, 
    div_text: {
        color: '#FFFFFF'
    },
    video: {
        objectFit: 'cover'
    }
}));

const VideoSmallView = (props) => {
    const {user_id, video_tag_id, user_name, track} = props;
    const classes = useStyles();
    const [overView, setOverView] = useState(false);

    const handleMouseOver = () => {
        setOverView(true);
    }
    const handleMouseLeave = () => {
        setOverView(false);
    }
    const handleClickSmallVideo = () => {
        track.attach($(`#mainVideo`)[0]);
    }
    return(
        <div id={user_id} className={classes.root} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={handleClickSmallVideo}>
            <video className={classes.video} autoPlay='1' id={video_tag_id} playsInline height='150' width='200' />
            <div className={overView ? classes.over_div_show : classes.over_div_hide} >
                <div className={classes.div_text}>{user_name}</div>
            </div>
        </div>
    );
}

export default VideoSmallView;