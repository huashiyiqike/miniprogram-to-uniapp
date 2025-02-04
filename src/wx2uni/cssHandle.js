const fs = require('fs-extra');
const path = require('path');

/*
*
* 处理css文件 
* 替换rpx为upx
*/
async function cssHandle(fileContent, miniprogramRoot, file_wxss) {
	let content = "";
	try {
		content = await new Promise((resolve, reject) => {
			let reg = /(\d+)rpx/g;
			fileContent = fileContent.replace(reg, "$1upx");
			fileContent = fileContent.replace(/.wxss/g, ".css");

			let reg_import = /@import +"(.*?)"/g;  //应该没有写单引号的呗？
			fileContent = fileContent.replace(reg_import, function (match, pos, orginText) {
				//先转绝对路径，再转相对路径
				let filePath;
				//wxss文件所在目录
				let fileDir = path.dirname(file_wxss);
				if (/^\//.test(pos)) {
					//如果是以/开头的，表示根目录
					filePath = path.join(miniprogramRoot, pos);
				} else {
					filePath = path.join(fileDir, pos);
				}
				filePath = path.relative(fileDir, filePath);
				//虽可用path.posix.前缀来固定为斜杠，然而改动有点小多，这里只单纯替换一下
				return '@import "' + filePath.split("\\").join("/") + '"';
			});

			// fileContent = fileContent.replace(/@import +"\//g, '@import "./');
			resolve(fileContent);
		});
	} catch (err) {
		console.log(err);
	}
	return content;
}

module.exports = cssHandle;
