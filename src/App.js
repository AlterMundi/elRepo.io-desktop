import React, { Component } from 'react';
import './App.css';

import { Provider } from 'react-redux';
import { store, history } from './redux/store';

import { RepoRouter } from './router';
import { SideMenu } from './components/sideMenu'
import { UserState } from './components/userState'
import { TiersState } from './components/tiersState'
import { SearchBar } from './components/searchBar'
import { ConnectedRouter } from "react-router-redux";
import { Layout, Icon } from 'antd';
const { Header, Sider, Content, Footer } = Layout;


class App extends Component {
  
  state = {
    collapsed: true,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
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
                <SideMenu collapsed={this.state.collapsed}/>
              </Sider>
              <Layout>
                <Header style={{ padding: 0, display: 'flex', alignItems: 'center'}}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <SearchBar />
                  <UserState />
                </Header>
                <Content style={{ overflowY: 'scroll', margin: '24px 16px', padding: 24, height: 'calc( 100vh - 145px)' }}>
                  <RepoRouter history={history} />
                </Content>
              </Layout>
            </Layout>
            <Footer style={{ padding: '6px 24px', background: '#131313', color: '#fff'}}>
              <TiersState />
            </Footer>
          </Layout>
          </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
