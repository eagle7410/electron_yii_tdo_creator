import React, { Component } from 'react';
import './App.css';
import AppHead from './componets/AppHead';
import Form from './componets/Form';

const formProps = {
	elements: {
		pathRoot: {
			type: 'text',
			label: 'Path create name space',
			placeholder: 'Enter path',
			validationState: null,
			required : 'required',
		},
		pathDir: {
			type: 'text',
			label: 'Path insert',
			placeholder: 'Enter path',
			validationState: null,
			required : 'required'
		},
		json : {
			type : 'textarea',
			rows : 20,
			label: 'Enter json',
			componentClass : 'textarea',
			placeholder : 'textarea',
			validationState: null,
			required : 'required'
		}
	}
};


class App extends Component {
	render() {
		return (
			<div className='App'>
				<AppHead/>

				<div className='App-body container'>
					<div className='row'>
						<Form {...formProps}/>
					</div>

				</div>
			</div>
		);
	}
}

export default App;
