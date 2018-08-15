import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'

class SideMenuComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to={'/'}>
                <Icon type="video-camera"/>
                <span>Navigate</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={'/upload'}>
                <Icon type="upload" />
                <span>Upload</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to={'/search'}>
                <Icon type="search" />
                <span>Search</span>
              </Link>
            </Menu.Item>
          </Menu>
        )
    }
}

export const SideMenu = connect(
    (state)=>({
        
    }),
    (dispatch)=>({

    })
)(SideMenuComponent)