import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
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
    }
}));

const VideoSmallView = (props) => {
    const classes = useStyles();
    const [overView, setOverView] = useState(false);

    const handleMouseOver = () => {
        setOverView(true);
    }
    const handleMouseLeave = () => {
        setOverView(false);
    }
    return(
        <div id={props.user_id} className={classes.root} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <video autoPlay='1' id={props.video_tag_id} playsInline height='150' width='200' />
            <div className={overView ? classes.over_div_show : classes.over_div_hide} >
                <div className={classes.div_text}>{props.user_name}</div>
            </div>
        </div>
    );
}

export default VideoSmallView;