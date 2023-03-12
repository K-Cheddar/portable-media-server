import React, {Component} from 'react';
import Presentation from './Presentation';

export default class LocalPresentation extends Component{
	render(){
		return (
			<Presentation type={'local'} currentInfo={this.props.currentInfo}
				backgrounds={this.props.backgrounds}/>
		);
	}
}
