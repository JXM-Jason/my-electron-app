/*
 * @Description: 
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 17:16:32
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-08-26 17:16:37
 * @FilePath: \my-electron-app\preload.js
 */
window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const dependency of ['chrome', 'node', 'electron']) {
		replaceText(`${dependency}-version`, process.versions[dependency])
	}
})