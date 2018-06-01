import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; 

import { Provider } from 'react-redux';
import { store } from './redux/store';

import { RepoRouter } from './router';
import { Sidebar } from './sidebar'
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;

class App extends Component {
  
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Layout>
            <Header style={{width: '100%', lineHeight: '20px', height: 'auto', padding: '5px', textAlign: 'right', background: '#f4f4f4'}} >
            <Icon type="minus"/> <Icon type="close"/>
            </Header>
            <Layout>
              <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
              >
                <div className="logo">
                    <Icon type="copy" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
                </Menu>
              </Sider>
              <Layout>
                <Header style={{ background: '#fff', padding: 0}}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </Header>
                <Content style={{ overflowY: 'scroll', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 'calc( 100vh - 145px)' }}>
                  <Sidebar />
                  <RepoRouter />
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
