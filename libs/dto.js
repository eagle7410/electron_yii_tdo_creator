const fs = require('fs');
const util = require('utils-igor')(['obj', 'arr', 'type', 'str']);
const doT = require('dot');

doT.templateSettings = {
	evaluate: /\{\{([\s\S]+?)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode: /\{\{!([\s\S]+?)\}\}/g,
	use: /\{\{#([\s\S]+?)\}\}/g,
	define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname: 'it',
	strip: false,
	append: false,
	selfcontained: false
};

/**
 * Check exist path and premision for him.
 * @method validPath
 * @param  {*}  data
 * @return {Promise}
 */
const validPath = data => new Promise((resolve, reject) => {

	data.pathDir = data.pathDir.trim();

	fs.access(data.pathDir, fs.constants.W_ok, e => {
		if (e) {
			console.error(e);
			return reject('pathDir access dinned');
		}

		resolve();
	});
});


/**
 * Validation data
 * @method validation
 * @param  {*}   data
 * @return {Promise}
 */
const validation = data => new Promise(
	(resolve, reject) => {
		validPath(data)
			.then(r => resolve(data))
			.catch(reject);
});


/**
 * Save file.
 * @method saveFile
 * @param  {string} path
 * @param  {string} content
 * @return {Promise}
 */
const saveFile = (path, content) => new Promise(
	(resolve, reject) => {

		fs.writeFile(path, content, (e) => {
			if (e) {
				console.error(e);
				return reject('noSaveFile');
			}

			resolve();
		});
	}
);
const path = require('path');

/**
 * Saved to files
 * @method saveToFiles
 * @param  {Object}    data
 * @return {Promise}
 */
const saveToFiles = (data) => new Promise(
	(resolve, reject) => {
		let filesSaved = [];
		const mainFolder = path.posix.basename(data.pathRoot);
		let ns = String(data.pathDir);
		ns = (mainFolder + ns.replace(data.pathRoot, '')).replace(/\//g, '\\');

		['temp-class', 'temp-interface'].forEach(template => {
			const suff = template === 'temp-class' ? '' : 'Interface';

			fs.readFile(__dirname + `/../views/${template}.php`, 'utf8', (e, temp) => {
				if (e) {
					console.error(e);
					return reject('noGetTemp');
				}

				let tempFn = doT.template(temp);

				try {

					util.obj.each(data.json, (className, props) => {
						let content = tempFn({props: props, ns: ns, className : className})
							.replace(/(\{\*)+/g, '{{')
							.replace(/(\*\})+/g, '}}');

						filesSaved.push(saveFile(`${data.pathDir}/${className+suff}.php`, content));
					});

				} catch (e) {
					console.error(e);
					return reject('noSaveFiles');
				}

			});
		});

		Promise.all(filesSaved)
			.then(r => resolve(r), e => reject(e));
	}
);

/**
 * Create migrations
 * @method create
 * @param  {object} data
 * @return {Promise}
 */
const create = data => new Promise(
	(resolve, reject) => {
		saveToFiles(data)
			.then(resolve)
			.catch(reject)
	}
);

/**
 * @type {Object}
 */
module.exports = {
	/**
	 * process parse data and create migration files.
	 * @method create
	 * @param  {{pathDir: string, json :object, pathRoot : string }} fromReq [description]
	 * @param  {function} call
	 */
	create: (fromReq, call) => {

		validation(fromReq)
			.then(data => create(data))
			.then(r => call(null))
			.catch(e => {
				let c = e;
				console.log('ERROR', e);
				if (util.type.isObj(e)) {
					c = e.message;
				}

				call(c);
			});
	}
};
