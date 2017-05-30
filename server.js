const electron = require('electron');
const ipcRenderer = electron.ipcMain;
const dialog = electron.dialog;
const send = require('./libs/send');
const dto = require('./libs/dto');
const listen = (action, handel) => {
	ipcRenderer.on(action, (event, arg) => {
		console.log(`:: ${action} `, arg);
		handel(event.sender,  action + '-response', arg);
	});
};

module.exports = {
	run : (mainWindow) => {
		listen('POST-dto', (res, action, data) => {
			dto.create(data, e => {
				e ? send.err(res, action, e) : send.ok(res, action);
			});
		});
		listen('GET-path-root', (res, action) => {
			let folder = dialog.showOpenDialog(mainWindow, {properties: ['openFile', 'openDirectory']});
			send.ok(res, action, {folder : !Array.isArray(folder) ? '' : folder.shift()});
		});
		listen('GET-path-folder', (res, action, defPath) => {
			let folder = dialog.showOpenDialog(mainWindow, {defaultPath : defPath || null, properties: ['openFile', 'openDirectory']});
			send.ok(res, action, {folder : !Array.isArray(folder) ? '' : folder.shift()});
		});
	}
};
