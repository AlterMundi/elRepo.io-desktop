import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Avatar  } from 'antd';
import { bindActionCreators } from 'redux';
import apiActions from '../redux/api/actions';
import { search } from '../redux/api/sagas';

const Meta = Card.Meta;

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

    render() {
        return (
            <div> 
                  <h2 style={{fontWeight:'300'}}>Searches</h2>
                  <ul>
                      {this.props.search.map(search => <li><a onClick={()=>this.setState({currentSearch: search})}>{search.search_string} - ({this.props.results[search.id]? this.props.results[search.id].length: 0})</a></li>)}
                  </ul>
                  {this.state.currentSearch? (
                    <div>
                        <h2 style={{fontWeight:'300'}}>Results of {this.state.currentSearch.search_string} ({this.props.results[this.state.currentSearch.id].length})</h2>
                            <ul>
                                {this.props.results[this.state.currentSearch.id].map(result => (
                                    <li key={result.id}>
                                        <b>{result.name}</b><br/>
                                        Size: {(result.size/1024).toLocaleString()} - Rank {result.rank}
                                    </li>
                                ))}
                        </ul>
                    </div>): false
                  }
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
    cert: state.Api.cert,
    channels: state.Api.channels,
    search: state.Api.search,
    results: state.Api.results
})

const dispatchToProps = (dispatch) => ({
    updateChannels: bindActionCreators(apiActions.updateChannels, dispatch),
    getResults: bindActionCreators(apiActions.updateSearchResults, dispatch)
})
  
export default connect(mapStateToProps, dispatchToProps)(Home)