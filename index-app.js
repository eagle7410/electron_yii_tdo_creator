/**
 * Created by igor on 21.05.17.
 */

const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
	let mainWindow = new BrowserWindow({
		width  : 800,
		height : 850,
		icon: __dirname + '/favicon.ico'
	});

	require('./server').run(mainWindow);
	// mainWindow.maximize();
	mainWindow.loadURL('file://' + __dirname + '/views/index.html');
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

});
