import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Badge } from 'antd'
import config from '../config';

class tiersStateComponent extends Component {
    
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
                { this.props.peers
                    .filter(peer => typeof peer.name !== 'undefined') 
                    .filter(peer => config.tiers1.map(tier => tier.id).indexOf(peer.id) !== -1) 
                    .map(peer => (
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
        peers: state.Api.peers|| []
    }),
    (dispatch)=>({

    })
)(tiersStateComponent)