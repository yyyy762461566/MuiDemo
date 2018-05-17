

/**
 * 判断是否为空
 * 
 * @param obj
 * @returns true为空,false不为空
 */
function isEmpty(obj) {
	if((typeof(obj) == undefined || obj == undefined || obj == "undefined" ||
			obj == null || obj == "" || obj == 'null')) {
		// if (!obj && typeof(obj)!="undefined" && obj!=0) {
		return true;
	} else {
		return false;
	}
}

/**
 * 获取请求携带的参数
 * @param {Object} name 参数名称
 */
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}
}