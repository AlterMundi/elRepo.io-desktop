import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Avatar  } from 'antd';
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions';
import VisibilitySensor from 'react-visibility-sensor';

const Meta = Card.Meta;

const trunc = (n, text) =>
        (text.length > n) ? text.substr(0, n-1) + '...' : text;

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.timer = null;
    }

    componentWillMount() {
        this.timer = setInterval(()=>{
            this.props.updateChannels();
        },10000)
    }

    checkExtraData(channel, channelInfo) {
        return (state) => {
            if (state === true && !channelInfo) {
                this.props.loadExtraData(channel.mGroupId)
            }
        }
    }

    render() {
        return (
            <div>
                  <h2 style={{fontWeight:'300'}}>Channels</h2>
                  {this.props.channels.map(channel => (
                    <VisibilitySensor partialVisibility={true} onChange={this.checkExtraData(channel, this.props.channelsInfo[channel.mGroupId])}>
                        <Card 
                            key={channel.channel_id}
                            style={{marginBottom: '15px'}}
                        >
                            <Meta
                                avatar={<Avatar src={ this.props.channelsInfo[channel.mGroupId]? 'data:image/png;base64,' + this.props.channelsInfo[channel.mGroupId].mImage.mData: false } />}
                                title={channel.mGroupName}
                                description={this.props.channelsInfo[channel.mGroupId]? trunc(140, this.props.channelsInfo[channel.mGroupId].mDescription): false}
                            />
                        </Card>
                    </VisibilitySensor>
                  ))}
            </div>
        )
    }    
}

const mapStateToProps = (state) => ({
    channels: state.Api.channels,
    channelsInfo: state.Api.channelsInfo,
})

const dispatchToProps = (dispatch) => ({
    updateChannels: bindActionCreators(apiActions.updateChannels, dispatch),
    loadExtraData: bindActionCreators(apiActions.loadExtraData, dispatch)
})
  
export default connect(mapStateToProps, dispatchToProps)(Home)