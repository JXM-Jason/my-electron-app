/*
 * @Description: 
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 16:52:51
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-08-26 17:21:21
 * @FilePath: \my-electron-app\main.js
 */
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})