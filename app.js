const { app, BrowserWindow } = require('electron');
const path = require('path')

app.whenReady().then(() => {
	createWindow();

	app.on('activate', function() {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') app.quit();
});

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
	event.preventDefault();
	callback(true);
});

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nativeWindowOpen: true
		},
		icon: __dirname + "/icon.png",
		show: false
	});
	win.removeMenu();
	win.loadFile('index.html')
	win.maximize()
	win.show()
}

// https://github.com/electron-userland/electron-builder