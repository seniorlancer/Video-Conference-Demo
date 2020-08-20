import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import {Button, Grid, TextField} from '@material-ui/core/';
import LogoImage from '../assets/images/avatar.png';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    container: {
        width: '100%',
        height: '100vh',
        position: 'fixed'
    },
    width_40: {
        width: '40%'
    },
    style_fields: {
        marginTop: '30px',
        width: '40%'
    },
    div_logo_area: {
        marginTop: '20px',
        marginLeft: '20px'
    },
    div_logo: {
        width: '80px',
        height: '80px',
        backgroundSize: 'cover',
        backgroundImage: 'url('+ LogoImage+')'
    }
}));

const CreateRoom = (props) => {
    const classes = useStyles();
    const {history} = props;

    const [name, setName] = useState('');
    const [roomname, setRoomName] = useState('');
    const [password, setPassword] = useState('');

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changeRoomName = (event) => {
        setRoomName(event.target.value);
    }

    const changePassword = (event) => {
        setPassword(event.target.value);
    }

    const clickCreateRoom = () => {
        history.push('/conferences');
        window.location.reload();
    }

    return(
        <div className={classes.root} >
            <div className={classes.div_logo_area}>
                <div className={classes.div_logo} />
            </div>
            <Grid className={classes.container}  container direction="column" justify="center" alignItems="center">
                <TextField className={classes.width_40} label="Your Name" variant="outlined" onChange={changeName} value={name}/>
                <TextField className={classes.style_fields} label="Room Name" variant="outlined" onChange={changeRoomName} value={roomname} />
                <TextField className={classes.style_fields} label="Room Password" variant="outlined" onChange={changePassword} value={password} />
                <Button className={classes.style_fields} variant="outlined" color="primary" onClick={clickCreateRoom} >Create Room</Button>
            </Grid>
        </div>
    );
}

CreateRoom.prototype = {
    
}

export default withRouter(CreateRoom);