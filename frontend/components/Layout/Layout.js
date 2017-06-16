// @flow
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import keydown from 'react-keydown';
import { Flex } from 'reflexbox';
import { textColor } from 'styles/constants.scss';

import DropdownMenu, { MenuItem } from 'components/DropdownMenu';
import LoadingIndicator from 'components/LoadingIndicator';

import SidebarCollection from './components/SidebarCollection';
import SidebarCollectionList from './components/SidebarCollectionList';
import SidebarLink from './components/SidebarLink';

import UserStore from 'stores/UserStore';
import AuthStore from 'stores/AuthStore';
import UiStore from 'stores/UiStore';
import CollectionsStore from 'stores/CollectionsStore';

type Props = {
  history: Object,
  collections: CollectionsStore,
  children?: ?React.Element<any>,
  actions?: ?React.Element<any>,
  title?: ?React.Element<any>,
  loading?: boolean,
  user: UserStore,
  auth: AuthStore,
  ui: UiStore,
  search: ?boolean,
  notifications?: React.Element<any>,
};

@observer class Layout extends React.Component {
  props: Props;

  static defaultProps = {
    search: true,
  };

  @keydown(['/', 't'])
  search() {
    if (this.props.auth.authenticated)
      _.defer(() => this.props.history.push('/search'));
  }

  @keydown(['d'])
  dashboard() {
    if (this.props.auth.authenticated)
      _.defer(() => this.props.history.push('/'));
  }

  handleLogout = () => {
    this.props.auth.logout(() => this.props.history.push('/'));
  };

  render() {
    const { user, auth, ui, collections } = this.props;

    return (
      <Container column auto>
        <Helmet
          title="Atlas"
          meta={[
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1.0',
            },
          ]}
        />

        {this.props.loading && <LoadingIndicator />}

        {this.props.notifications}

        <Flex auto>
          {auth.authenticated &&
            user &&
            <Sidebar column>
              <Header justify="space-between">
                <Flex align="center">
                  <LogoLink to="/">Atlas</LogoLink>
                </Flex>
                <DropdownMenu label={<Avatar src={user.user.avatarUrl} />}>
                  <MenuLink to="/settings">
                    <MenuItem>Settings</MenuItem>
                  </MenuLink>
                  <MenuLink to="/keyboard-shortcuts">
                    <MenuItem>
                      Keyboard shortcuts
                    </MenuItem>
                  </MenuLink>
                  <MenuLink to="/developers">
                    <MenuItem>API</MenuItem>
                  </MenuLink>
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </DropdownMenu>
              </Header>

              <Flex column>
                <LinkSection>
                  <SidebarLink to="/search">Search</SidebarLink>
                </LinkSection>
                <LinkSection>
                  <SidebarLink to="/dashboard">Dashboard</SidebarLink>
                  <SidebarLink to="/starred">Starred</SidebarLink>
                </LinkSection>
                <LinkSection>
                  {ui.activeCollection
                    ? <SidebarCollection
                        collection={collections.getById(ui.activeCollection)}
                      />
                    : <SidebarCollectionList />}
                </LinkSection>
              </Flex>
            </Sidebar>}

          <Content auto justify="center">
            {this.props.children}
          </Content>
        </Flex>
      </Container>
    );
  }
}

const Container = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const LogoLink = styled(Link)`
  margin-top: 5px;
  font-family: 'Atlas Grotesk';
  font-weight: bold;
  color: ${textColor};
  text-decoration: none;
  font-size: 16px;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const MenuLink = styled(Link)`
  color: ${textColor};
`;

const Content = styled(Flex)`
  height: 100%;
  overflow: scroll;
`;

const Sidebar = styled(Flex)`
  width: 250px;
  padding: 10px 20px;
  background: rgba(250, 251, 252, 0.71);
  border-right: 1px solid #eceff3;
`;

const Header = styled(Flex)`
  margin-bottom: 20px;
`;

const LinkSection = styled(Flex)`
  margin-bottom: 20px;
  flex-direction: column;
`;

export default withRouter(inject('user', 'auth', 'ui', 'collections')(Layout));
