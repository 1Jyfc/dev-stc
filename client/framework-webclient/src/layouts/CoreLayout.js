import React, { Component, PropTypes } from 'react'
import 'STYLES/antd.min.css'
import 'STYLES/core.scss'
import './CoreLayout.scss'

import { Layout, Menu, Breadcrumb, Icon, Row, Col, Tabs, message, Modal, Form, Input } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

import Logo from './assets/logo.png';

import tabsMap from 'routes/tabsMap';

import {logoutService, resetPasswordService} from 'services';
import {sysFetch} from 'utils/FetchUtil';

export default class CoreLayout extends Component
{
	constructor(props) {
		super(props);
	};

	static propTypes = {
		modules: PropTypes.array.isRequired,
		panes: PropTypes.array.isRequired,
        activeKey: PropTypes.string.isRequired,
        addTab: PropTypes.func.isRequired,
        removeTab: PropTypes.func.isRequired,
        switchTab: PropTypes.func.isRequired
	};

	handleClick = (e) =>{
        let menu = findMenuByKey(e.key, this.props.modules);
        let component = findPageByPath(menu.menuPath, tabsMap);
        this.props.addTab(this.props.panes, menu.id, menu.name, component);
    };

    onEdit = (targetKey) => {
        this.props.removeTab(this.props.panes,this.props.activeKey,targetKey);
    };

    onChange = (activeKey) => {
        this.props.switchTab(activeKey);
    };

	render(){
		return (
			<Layout>
                <Sider>
		        	<Row>
	                	<div className="logoV2Container" style={{marginBottom: '20px', background: '#012c33'}}>
	                		<img src={Logo} className="logoV2"></img>
	                	</div>
	                </Row>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={this.defaultSelectedKeys}
                        onClick={this.handleClick}
                    >
                        {this.props.modules.map(item => <Menu.Item key={item.id}><Icon type={item.menuIcon} />{item.name}</Menu.Item>)}
                    </Menu>
                </Sider>
            	<Layout>
			        <Content style={{ margin: '0px 16px', padding: 24, background: '#fff', minHeight: 800 }}>
			            <Tabs 
	                		className="contentTab" 
	                		type="editable-card" 
	                		onChange={this.onChange}
					        onEdit={this.onEdit}
	                		hideAdd="true" 
	                		activeKey={this.props.activeKey}>
					      	{this.props.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
					    </Tabs>   
			        </Content>
			        <Footer style={{ textAlign: 'center' }}>
			            出品：南京大学计算机系15级软工在线业务组
			        </Footer>
			    </Layout>
            </Layout>
		);
	}
}


function findMenuByKey(key, menus) {
	let _menu = null;

	for(let i=0; i<menus.length; i++) {
        let menu = menus[i];

        if (menu.id === key) {
            _menu = menu;
            return _menu;
        }
    }
	return _menu;
}

function findPageByPath(path, pages) {
	for(let i=0; i<pages.length; i++) {
		let page = pages[i];

		if(page.path === path) {
			return page.component;
		}
	}
	return null;
}