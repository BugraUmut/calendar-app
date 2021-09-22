const { app, BrowserWindow } = require('electron');

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
		}
	});
	win.removeMenu();
	win.webContents.openDevTools();
	win.loadFile('index.html')
}
