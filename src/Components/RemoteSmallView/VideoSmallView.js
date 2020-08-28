import React, {useEffect, useState, Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as $ from 'jquery';
import './remotesmallview.css';

export default class VideoSmallView extends Component {
    constructor(props) {
        super(props);

        this.state = {track:this.props.track, video_tag_id: this.props.video_tag_id, user_name:this.props.user_name, overView: false};
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleClickSmallVideo = this.handleClickSmallVideo.bind(this);
    }
    handleMouseOver() {
        this.setState({overView: true});
    }
    handleMouseLeave() {
        this.setState({overView: false});
    }
    handleClickSmallVideo() {
        this.state.track.attach($(`#mainVideo`)[0]);      
    }

    componentDidMount() {
        this.state.track.attach($(`#${this.state.video_tag_id}`)[0]);
    }

    componentWillUnmount() {
        this.state.track.detach($(`#${this.state.video_tag_id}`)[0]);
    }

    render() {
        return(
            <div id={'div' + this.state.video_tag_id} className="root" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} onClick={this.handleClickSmallVideo}>
                <video className="video" autoPlay='1' id={this.state.video_tag_id} playsInline height='150' width='200' />
                <div className={this.state.overView ? "over_div_show" : "over_div_hide"} >
                    <div className="div_text">{this.state.user_name}</div>
                </div>
            </div>
        );
    }
}