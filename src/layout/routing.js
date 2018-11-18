import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Navigation from './navigation'
import { SingleContent } from './contentTemplate.js'
import Dining from '../container/dining'
import HeatMap from '../container/diningHeatMap'
import Movie from '../container/movie'
import Expense from '../container/expense'
import ExpenseLineChart from '../container/expenseLineChart'
import Settings from '../container/settings'
import Login from '../container/authentication/login'
import Register from '../container/authentication/register'
import storage from '../utils/Storage'
import UserProfile from '../container/userProfile'
import { Layout, Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import FindUser from '../container/findUser'

const { Content, Sider, Footer } = Layout
const MenuItemGroup = Menu.ItemGroup

export const BaseLayout = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <div>
          <Layout>
            <Navigation matchProps={matchProps} />
            <Layout>
              <Sider
                collapsible
                breakpoint='lg'
                collapsedWidth='0'
                onBreakpoint={broken => {
                  console.log(broken)
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type)
                }}
                width={170}
                style={{ background: '#fff' }}
              >
                <Menu
                  mode='inline'
                  defaultSelectedKeys={['1', '3', '4', '6', '7']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  {matchProps.match.path.startsWith('/dining') &&
                    <MenuItemGroup title='Dining'>
                      <Menu.Item key='1'>
                        <Link to='/dining/find_restaurant'>
                          <Icon type='search' theme='outlined' />
                          Find Restaurants
                        </Link>
                      </Menu.Item>
                      <Menu.Item key='2'>
                        <Link to='/dining/restaurant_heatmap'>
                          <Icon type='heat-map' theme='outlined' />
                          Heat Map
                        </Link>
                      </Menu.Item>
                    </MenuItemGroup>}
                  {matchProps.match.path === '/movie' &&
                    <MenuItemGroup title='Movie'>
                      <Menu.Item key='3'>Find a movie</Menu.Item>
                    </MenuItemGroup>}
                  {matchProps.match.path.startsWith('/expense') &&
                    <MenuItemGroup title='Expense'>
                      <Menu.Item key='4'>
                        <Link to='/expense'>
                          <Icon type="dollar" />
                          All transactions
                        </Link>
                      </Menu.Item>
                      <Menu.Item key='5'>
                        <Link to='/expense/line_chart'>
                          <Icon type="line-chart" />
                          Line chart
                        </Link>
                      </Menu.Item>
                    </MenuItemGroup>}
                  {matchProps.match.path === '/find_user' &&
                    <MenuItemGroup title='Social'>
                      <Menu.Item key='6'>Search User</Menu.Item>
                    </MenuItemGroup>}
                  {matchProps.match.path === '/my_profile' &&
                    <MenuItemGroup title='User Profile'>
                      <Menu.Item key='7'>Account information</Menu.Item>
                      <Menu.Item key='8'>My following</Menu.Item>
                      <Menu.Item key='9'>My followers</Menu.Item>
                      <Menu.Item key='10'>My favorite/wish list</Menu.Item>
                    </MenuItemGroup>}
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                  style={{
                    background: '#fff',
                    padding: 24,
                    marginTop: '30px',
                    minHeight: 280
                  }}
                >
                  <Component {...matchProps} />
                </Content>

                <Footer id='footer'>I don't know the app's name</Footer>
              </Layout>
              <Sider
                defaultCollapsed
                collapsible
                reverseArrow
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type)
                }}
                width={200}
                style={{ background: '#fff' }}
              >
                Message
              </Sider>
            </Layout>
          </Layout>
        </div>
      )}
    />
  )
}
const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SingleContent size='s'>
        <h1
          style={{
            padding: '100px 0',
            color: '#bbb',
            fontWeight: '600'
          }}
        >
          The Page you are looking for does not exist!
        </h1>
      </SingleContent>
    </div>
  )
}

class PrivateRoute extends Component {
  render () {
    return (
      <div>
        <BaseLayout {...this.props} />
      </div>
    )
  }
}
export class ComponentRoutes extends Component {
  render () {
    return (
      <Switch>
        <PrivateRoute exact path='/dining/find_restaurant' component={Dining} />
        <PrivateRoute
          exact
          path='/dining/restaurant_heatmap'
          component={HeatMap}
        />

        <PrivateRoute exact path='/movie' component={Movie} />
        <PrivateRoute exact path='/find_user' component={FindUser} />
        <PrivateRoute exact path='/expense' component={Expense} />
        <PrivateRoute exact path='/expense/line_chart' component={ExpenseLineChart} />
        <PrivateRoute exact path='/my_profile' component={UserProfile} />
        <PrivateRoute exact path='/settings' component={Settings} />
        <Redirect from='/' to='/dining/find_restaurant' />
        <Redirect from='/dinings' to='/dining/find_restaurant' />
        <Redirect from='/movies' to='/movie' />
        <Redirect from='/expenses' to='/expense' />
        <Redirect from='/setting' to='/settings' />

        <PrivateRoute component={NotFoundPage} />
      </Switch>
    )
  }
}

class AuthRoutes extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Redirect from='/' to='/login' />
      </Switch>
    )
  }
}

class Routing extends Component {
  render () {
    return (
      <div className='Routing'>
        <Router>
          <div>
            {storage.isLoggedIn() ? <ComponentRoutes /> : <AuthRoutes />}
          </div>
        </Router>
      </div>
    )
  }
}

export default Routing
