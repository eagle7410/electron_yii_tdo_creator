/**
 * Created by igor on 11.02.17.
 */
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';
import { map, keys } from '../utils/Obj';
import { save, get } from '../utils/Req';

export default class Form extends Component {
	constructor(props) {
		super(props);

		let state = {};
		keys(this.props.elements).map(key => state[key] = '');
		map(this.props.elements, (id, val) => {
			val.onChange = this.handelChangeInput.bind(this)
		});
		this.state = state;
	}

	_changeState(key, val) {
		let state = this.state;
		state[key] = val;
		return state;
	}

	handelChangeInput(ev) {
		let el = ev.target;
		this.setState(this._changeState(el.id, el.value));
	}

	handelSubmit(ev) {
		ev.preventDefault();
		let that = this;
		let data = that.state;

		try {
			data.json = JSON.parse(data.json);
		} catch (e) {
			console.log('Error json parse', e);
			that.state.error = true;
			that.state.message = 'Bad Json.';
			return that.setState(that.state);
		}

		save('dto', data).then(r => {
				let state = { success : false };

				if (r.status === 'OK') {
					state.sucess = true;
				} else {
					state.error = true;
					state.message = 'Error create.';
				}

				this.setState(state);
			},
			err => {
				this.setState({
					error : true,
					message : 'Bad response from server'
				});
				console.log('handelSubmit/Responce/Error', err);
			});
	}

	handelSetPathRoot(ev) {

		let that = this;

		get('path-root')
			.then(r => {

				if (!r.data.folder) {
					return;
				}

				let folder = r.data.folder;
				this.setState(this._changeState('pathRoot', folder));

			},r => {
				that.setState({
					error : true,
					message : 'Bad response from server'
				});
				console.log('handelSetPathRoot/Responce/Error', r);
			})

	}
	handelSetPathFolder(ev) {
		let that = this;

		get('path-folder', that.state.pathRoot)
			.then(r => {

				if (!r.data.folder) {
					return;
				}

				let folder = r.data.folder;
				that.props.elements.pathDir.value = folder;
				that.setState(that._changeState('pathDir', folder));

			},r => {
				console.log('handelSetPathFolder/Responce/Error', r);
				that.setState({
					error : true,
					message : 'Bad response from server'
				});
			})

	}

	warns () {
		if (!this.state.warn || !this.state.warn.length)
			return null;

		return map(this.state.warn, (table, row) => (
			<div class='alert alert-warning'>
			  <strong>Warning!</strong> No used colum {row.colum} in tabel {table}.
			</div>
		));
	}

	render() {
		let alerts = '';

		if (this.state.sucess) {
			alerts = (
					<div className='alert alert-success'>
						<strong>Success!</strong> Files created.
					</div>
				);
		} else if (this.state.error) {
			alerts = (
					<div className='alert alert-danger'>
						<strong>Error!</strong> {this.state.message}.
					</div>
				);
		}

		this.props.elements.pathRoot.value = this.state.pathRoot;
		this.props.elements.pathDir.value = this.state.pathDir;
		this.props.elements.json.value = this.state.json;

		return (
			<div className='form' >
				{ alerts }
				{ this.warns() }
				<form onSubmit={ this.handelSubmit.bind(this) } id='formId' >
					<div className='col-lg-6' >
						<div className="btn-group" style={{marginRight:'5px'}}>
							<label className="btn btn-default" onClick={ this.handelSetPathRoot.bind(this) }>
								Set path root
							</label>
							<input type="text" id="label" className="btn" placeholder="Folder" disabled value={this.state.pathRoot} />
						</div>
						<div className="btn-group" >
							<label className="btn btn-default" onClick={ this.handelSetPathFolder.bind(this) }>
								Set path insert
							</label>
							<input type="text" id="label" className="btn" placeholder="Folder" disabled value={this.state.pathDir} />
						</div>
						{ map(this.props.elements, (id, vals) => <FieldGroup key={	id } id={ id } { ...vals } />) }
						<button id='submit' type='submit' className='btn btn-primary'>Submit</button>
					</div>
				</form>
			</div>
		);
	}
}
