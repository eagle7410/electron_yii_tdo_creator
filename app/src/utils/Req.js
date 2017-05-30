const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

/**
 * Send to server.
 * @method send
 * @param  {string} url
 * @param  {*} data
 * @param  {*} method
 * @param  {*} headers
 * @return {Promise}
 */
const send = (url, data, method, headers) => new Promise((resolve) => {
	const action = `${method}-${url}`;

	ipcRenderer.send(action, data);

	ipcRenderer.on(action +'-response', (event, data) => {
		resolve(data);
	})
});

/**
 * Send for save.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const save   = (url, data, headers) => send(url, data, 'POST', headers);
/**
 * Send for get.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const get    = (url, data, headers) => send(url, data, 'GET', headers);
/**
 * Send for delete.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const move = (url, data, headers) => send(url, data, 'DELETE', headers);
/**
 * Send for update.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const update = (url, data, headers) => send(url, data, 'PUT', headers);

export { save, get, move, update };
