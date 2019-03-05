import React, {Component} from 'react';
import Presentation from './Presentation';

export default class RemotePresentation extends Component{
	render(){
		return (
			<Presentation type={'remote'} currentInfo={this.props.currentInfo}
				backgrounds={this.props.backgrounds} setAsReceiver={this.props.setAsReceiver}/>
		);
	}
}
