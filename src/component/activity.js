import React, { Component } from "react";
import storage from '../utils/Storage';
import config from '../config.js';
import axios from 'axios';
import { List, Card, Tooltip, Pagination, Spin } from 'antd';
import 'antd/dist/antd.css';
import moment from "moment";

var user = storage.getUserInfo();
const pageSize = 10;

class Activity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            logs: [],
            loading: true,
            userType: props.userType
        }

        this.getUserLog = this.getUserLog.bind(this);

        this.getUserLog(1, pageSize);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            url: newProps.url,
            userType: newProps.userType
        });

        this.getUserLog(1, pageSize);

        this.forceUpdate();
    }

    getUserLog(page, pageSize) {
        
        // at this point, we determine user type and request type
        var userId = this.state.userType === 'admin' ? '' : user.id;

        this.setState({
            loading: true
        });

        this.forceUpdate();

        axios({
            method: 'get',
            url: config.base_url + this.state.url + userId + '?page=' + page + '&perPage=' + pageSize,
            headers: {
                'Authorization': 'Bearer ' + storage.getAuthToken()
            }
        }).then( (response) => {

            this.setState({
                loading: false,
                logs: response.data.data
            });
            console.log(response.data.data[0].at);
            this.forceUpdate();

        }).catch( (error) => {

            this.setState({
                loading: false
            });

            this.forceUpdate();

        });
    }

    render() {

        return (
            <div>
                <Spin spinning={this.state.loading} delay={100}>
                    <Card style={{width: '70%', margin: '0 auto'}}>
                        <List
                            header={<div>Activities</div>}
                            footer={''}
                            bordered
                            dataSource={this.state.logs}
                            renderItem={item => (
                                <List.Item>
                                    <div style={{fontSize: '12pt', color: '#7a7a7a'}}> 
                                            <span style={{fontWeight: 'bold'}}> <Tooltip title={item.from.email}>{item.from.username}  </Tooltip></span>  <span> </span>
                                            <span style={{color: '#029cfc', fontWeight: 'bold'}}>{item.activity}</span><span> </span>
                                            <span style={{fontWeight: 'bold'}}><Tooltip title={item.to.email}>{item.to.username}</Tooltip></span> at <span> </span>
                                            <span style={{fontWeight: 'bold'}}>{moment.unix(parseInt(item.at)).format("YYYY-MM-DD HH:MM:SS")}</span>
                                    </div>
                                </List.Item>)}
                        /> <br/>
                        <Pagination 
                            defaultCurrent={1} total={100} 
                            onChange={(page, pageSize) => {
                                this.getUserLog(page, pageSize);
                            }}
                        />
                    </Card>
                </Spin>
            </div>
        );
    }


}

export default Activity;
