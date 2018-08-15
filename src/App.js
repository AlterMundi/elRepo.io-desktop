import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; 

import { Provider } from 'react-redux';
import { store } from './redux/store';

import { RepoRouter } from './router';
import { Sidebar } from './sidebar'
import { SideMenu } from './components/sideMenu'
import { UserState } from './components/userState'
import { TiersState } from './components/tiersState'
import { SearchBar } from './components/searchBar'
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content, Footer } = Layout;


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
            <Layout>
              <Sider
                trigger={null}
                theme="light"
                collapsible
                collapsed={this.state.collapsed}
              >
                <div className="logo">
                    <Icon type="copy" />
                </div>
                <SideMenu />
              </Sider>
              <Layout>
                <Header style={{ background: '#fff', padding: 0, display: 'flex', alignItems: 'center'}}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <SearchBar />
                  <UserState />
                </Header>
                <Content style={{ overflowY: 'scroll', margin: '24px 16px', padding: 24, background: '#fff', height: 'calc( 100vh - 145px)' }}>
                  <Sidebar />
                  <RepoRouter />
                </Content>
              </Layout>
            </Layout>
            <Footer style={{ padding: '6px 24px', background: '#131313', color: '#fff'}}>
              <TiersState />
            </Footer>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
