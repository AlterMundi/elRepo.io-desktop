import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Avatar  } from 'antd';
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions';

const Meta = Card.Meta;

class Home extends Component {
    constructor(props) {
        super(props)
        this.timer;
    }

    componentDidMount() {
        this.timer = setInterval(()=>{
            this.props.updateChannels();
        },30000)
    }

    render() {
        return (
            <div>   
                  <h2 style={{fontWeight:'300'}}>Channels</h2>
                  {this.props.channels.map(channel => (
                    <Card 
                        key={channel.channel_id}
                        style={{marginBottom: '15px'}}
                    >
                        <Meta
                            avatar={<Avatar src={ 'data:image/png;base64,' + channel.thumbnail_base64_png} />}
                            title={channel.name}
                            description={channel.description}
                        />
                    </Card>
                  ))}
            </div>
        )
    }    
}

const mapStateToProps = (state) => ({
    runstate: state.Api.runstate,
    cert: state.Api.cert,
    channels: state.Api.channels
})

const dispatchToProps = (dispatch) => ({
    updateChannels: bindActionCreators(apiActions.updateChannels, dispatch)
})
  
export default connect(mapStateToProps, dispatchToProps)(Home)