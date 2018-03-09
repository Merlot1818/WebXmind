/**
 * Created by Jad_PC on 2018/2/7.
 */
import React from 'react';
import {sessionActions} from './../actions';
import {connect} from 'react-redux';
import {Button, Icon} from 'antd';
import styles from './Logout.scss';

class Home extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Button
                className={styles.btn}
                title="点击登出"
                onClick={this.props.onLogout}
            >
                <Icon type="user"/>
                {this.props.user}
            </Button>
        );
    }
}

const mapStateToProps = state => ({
    user: state.getSession.user
});

const mapDispatchToProps = dispatch => ({
    onLogout: () => {
        dispatch(sessionActions.logout('request'));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
