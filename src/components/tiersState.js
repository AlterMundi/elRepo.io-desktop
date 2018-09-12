import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Avatar, Badge } from 'antd'

class tiersStateComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const stateToColor = (state_string) => {
            switch(state_string) {
                case 1:
                    return 'yellow'
                case 2:
                    return 'green'
                case 4:
                    return 'green'
                default:
                    return 'red'
            }
        }
        return (
            <div style={{float: 'right', marginRight: '24px'}}>
                <span>Global connections: </span>
                { this.props.peers.map(peer => (
                        <Badge dot key={peer.id} style={{backgroundColor: stateToColor(peer.connectState), marginRight:'10px'}}>
                            <span style={{color: '#fff'}}>{peer.name}</span>
                        </Badge>
                ))}
            </div>
        )
    }
}

export const TiersState = connect(
    (state)=>({
        peers: state.Api.peersData || []
    }),
    (dispatch)=>({

    })
)(tiersStateComponent)