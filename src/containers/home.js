import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Avatar, Table, Divider, Button  } from 'antd';
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions';
import VisibilitySensor from 'react-visibility-sensor';
import filesize from 'filesize';

const Meta = Card.Meta;

const trunc = (n, text) =>
        (text.length > n) ? text.substr(0, n-1) + '...' : text;

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.timer;
    }

    componentDidMount() {
        this.timer = setInterval(()=>{
            this.props.updateChannels();
        },30000)
    }

    checkExtraData(channel, channelInfo) {
        return (state) => {
            if (state === true && !channelInfo) {
                this.props.loadExtraData(channel.mGroupId)
            }
        }
    }

    render() {

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span>{text}</span>,
        }, {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size, record)=> <span>{filesize(Number(size || 0), {bits: true})}</span>
        }, {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                <Button onClick={()=>console.log(record)}>Download</Button>
                <Divider type="vertical" />
                <Button onClick={()=>console.log(record)}>More info</Button>
                </span>
            ),
        }];

        return (
            <div> 
                  <h2 style={{fontWeight:'300'}}>Search results <b>{this.props.search}</b> ({this.props.results.length})</h2>
                  {this.props.results.length > 0? (
                    <div>
                        <Table columns={columns} dataSource={this.props.results} size="small"/>
                    </div>): false
                  }
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
    cert: state.Api.cert,
    channels: state.Api.channels,
    channelsInfo: state.Api.channelsInfo,
    search: state.Api.search,
    results: state.Api.results
})

const dispatchToProps = (dispatch) => ({
    updateChannels: bindActionCreators(apiActions.updateChannels, dispatch),
    loadExtraData: bindActionCreators(apiActions.loadExtraData, dispatch),
    getResults: bindActionCreators(apiActions.updateSearchResults, dispatch)
})
  
export default connect(mapStateToProps, dispatchToProps)(Home)