"use strict";
/*!
 * MSeditor
 * version: 1.0.0
 * http://www.hasbox.com
 */
(function(){
	if (window.MSeditor) return;
	/**
	 * @class MSeditor
	 * 整个的 MSeditor 代码运行在此对象之下
	 * @singleton
	 */
	window.MSeditor = function() {};


	//*************************************************************************************
	//编辑器底层
	//*************************************************************************************
	
	/**
	 * @enum {Object} MSeditor.BROWSER
	 * 返回当前浏览器版本号.
	 *
	 *     if(MSeditor.BROWSER.ie){
	 *          alert("您使用的浏览器是IE");
	 *     }
	 *     if(MSeditor.BROWSER.ie && MSeditor.BROWSER.ie<7){
	 *          alert("将不支持低于7.0的IE浏览器");
	 *     }
	 *
	 * 		alert(MSeditor.BROWSER.opera); // 11.6
	 *
	 * @readonly
	 * @singleton
	 * @return {Object}
	 */
	
	/**
	 * 
	 * @property {Number} ie
	 * 将返回 6 7 8 9 10 等版本号.
	 * @return {Number} 版本号
	 */
	/**
	 * @property {Number} firefox
	 * firefox将返回 31 33 36 等版本号.
	 * @return {Number} 版本号
 	 */
	/**
	 * @property {Number} safari
	 * safari将返回 5.1 6 7 等版本号.
	 * @return {Number} 版本号
 	 */
	/**
	 * @property {Number} chrome
	 * chrome将返回 35 36 37 等版本号.
	 * @return {Number} 版本号
 	 */
	/**
	 * @property {Number} opera
	 * opera将返回 11.6 12 等版本号.
	 * @return {Number} 版本号
 	 */
	/**
	 * @property {Number} webKit
	 * webKit引擎浏览器将返回 537.4 537.36 等版本号.
	 * @return {Number} 版本号
 	 */
	/**
	 * @property {Number} gecko
	 * gecko引擎浏览器将返回 20100101 等版本号.
	 * @return {Number} 版本号
	 */
	MSeditor.BROWSER = function() {
		var version = {
			ie: '',
			firefox: '',
			safari: '',
			chrome: '',
			opera: '',
			webKit: '',
			gecko: ''
		};
		var ua = navigator.userAgent;
		if (window.opera) {
			version.opera = parseFloat(window.opera.version());
		} else if (/AppleWebKit\/(\S+)/.test(ua)) {
			version.webKit = parseFloat(RegExp["$1"]);
			if (/Chrome\/(\S+)/.test(ua)) {
				version.chrome = parseFloat(RegExp["$1"]);
			} else if (/Version\/(\S+)/.test(ua)) {
				version.safari = parseFloat(RegExp["$1"]);
			} else {
				//approximate version
				var safariVersion = 1;
				if (version.webKit < 100) {
					safariVersion = 1;
				} else if (version.webKit < 312) {
					safariVersion = 1.2;
				} else if (version.webKit < 412) {
					safariVersion = 1.3;
				} else {
					safariVersion = 2;
				}
				version.safari = safariVersion;
			}
		} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
			version.engine = 'gecko';
			//determine if it's Firefox
			if (/Firefox\/(\S+)/.test(ua)) {
				version.firefox = parseFloat(RegExp["$1"]);
			}
		} else if (/(MSIE) |(Trident)/.test(ua)) {
			if (/MSIE ([^;]+)/.test(ua)) {
				version.ie = parseFloat(RegExp["$1"]);
			} else if (/rv:([^\)]+)/.test(ua)) {
				version.ie = parseFloat(RegExp["$1"]);
			}
		}
		return version;
	}();
	
	(function() {
		var scriptElements = document.scripts;
		var jsPath = scriptElements[scriptElements.length - 1].src;
		if (jsPath.indexOf('/') < 0) {
			jsPath = location.href.slice(0, jsPath.lastIndexOf('/') + 1);
		} else if (!MSeditor.BROWSER.ie || MSeditor.BROWSER.ie > 7) {
			jsPath = jsPath.slice(0, jsPath.lastIndexOf('/') + 1);
		} else {
			var hostName = location.hostname;
			if (hostName != '')
				hostName.replace(/(\b'www.')/, '');
			var patt = new RegExp(':' + (hostName ? '|' + hostName : ''));
			if (patt.test(jsPath)) {
				jsPath = jsPath.slice(0, jsPath.lastIndexOf('/') + 1);
			} else {
				var href = location.href.slice(0, location.href.lastIndexOf('/') + 1);
				jsPath = href + jsPath.slice(0, jsPath.lastIndexOf('/') + 1);
			}
		}
		/**
		 * @enum {Object} MSeditor.PATH
		 * 返回编辑器目录结构.
		 * 
		 * 		MSeditor.PATH.root; // https://http://www.360cities.net/MSeditor/
		 *
		 * @readonly
		 * @singleton
		 * @return {Object}
	 	 */
	 	
		/** 
		 * @property {String} root
		 * 根目录.
		 * @return {String} 根目录路径
	 	 */
	 	
		/** 
		 * @property {String} style
		 * style 目录.
		 * @return {String} style 目录路径
	 	 */
	 	
		/**  
		 * @property {String} skin
		 * skin 目录.
		 * @return {String} skin 目录路径
	 	 */
	 	
		/**  
		 * @property {String} plugins
		 * plugins 目录.
		 * @return {String} plugins 目录路径
	 	 */
		MSeditor.PATH = {
			
			root: jsPath,
			style: jsPath + 'style/',
			skin: jsPath + 'skins/',
			plugins: jsPath + 'plugins/'
			//require: jsPath + 'require/'
		};
	})();

	/**
	 * @class MSeditor.utils
	 * 静态工具函数集合
	 * @singleton
	 */

	MSeditor.utils = function() {
		var functions = [],
			expandMs = 'MSeditorExpand';
		return {


			/**
			 * 返回一个 msTitle 属性文本
			 *
			 * 		MSeditor.utils.msTitleAttr('属性文本'); // data-ms-title="属性文本"
			 * @param  {String} data msTitle 的内容
			 * @return {String}  属性文本
			 */
			msTitleAttr: function(data) {
				return 'data-ms-title="' + data + '"';
			},
			/**
			 * 获取浏览器窗口宽度.
			 * @param  {Window} windw 目标 window 对象
			 * @return {Number}  窗口宽度像素 
			 */
			clientWidth: function(windw) {
				win = windw || window;
				if(win.innerWidth){
					return win.innerWidth;
				}
				var doc=win.document;
				return doc.body.clientWidth || doc.documentElement.clientWidth;
			},
			/**
			 * 获取浏览器窗口高度.
			 * @param  {Window} windw 目标 window 对象 
			 * @return {Number}  窗口高度像素 
			 */
			clientHeight: function(windw) {
				win = windw || window;
				if(win.innerHeight){
					return win.innerHeight;
				}
				var doc=win.document;
				return doc.body.clientHeight || doc.documentElement.clientHeight;
			},
			/**
			 * 将原生节点列表或对象转换到数组.
			 * @param  {NodeList/Object} obj 目标对象
			 * @return {Array} 转换后的数组
			 */
			makeArray: function(obj) {
				try {
					return Array.prototype.slice.call(obj, 0);
				} catch (e) {
					var arr = [];
					for (var i = 0, len = obj.length; i < len; i++) {
						//arr.push(s[i]);
						arr[i] = obj[i]; //据说这样比push快
					}
					return arr;
				}

			},
			/**
			 * 获取一个以标记文本.
			 * 		MSeditor.utils.MSMark(); // "%mseMark1457666074925"
			 * @return {String} 返回标记文本
			 */
			MSMark: function() {
				return '%mseMark' + new Date().getTime();
			},
			/**
			 * 向数组的末尾或开头添加一个或更多元.
			 * @param  {Array} array 目标数组
			 * @param  {Array/Object} obj 追加的元素
			 * @param  {Boolean} toStart 可选／添加在开头或末尾，默认添加到末尾
			 * @return {Array} 一个新的数组
			 */
			pushToArray: function(array, obj, toStart) {
				if (!this.isArray(obj)) {
					obj = [obj];
				}
				if (toStart === true) {
					array = obj.concat(array);
				} else {
					array = array.concat(obj);
				}
				return array;
			},
			/**
			 * 创建一个函数的引用，之后使用callfunction调用.
			 *
			 *     var ref = MSeditor.utils.addFunction( function() {
			 *         alert( 'Hello!');
			 *     } );
			 *     MSeditor.utils.callFunction( ref ); // 'Hello!'
			 *     
			 * @param {Function} fn  调用时要执行的函数
			 * @param {Object} scope  调用函数时运行的上下文
			 *
			 * @return {Number}  fn在函数列表中的索引
			 */
			addFunction: function(fn, scope) {
				return functions.push(function() {
					return fn.apply(scope || this, arguments);
				}) - 1;
			},


			/**
			 * 调用addFunction添加的函数.
			 *
			 *     var ref = MSeditor.utils.addFunction( function() {
			 *         alert( 'Hello!');
			 *     } );
			 *     MSeditor.utils.callFunction( ref ); // 'Hello!'
			 *     
			 * @param {Number} ref  调用函数的索引值
			 *
			 * @return {Mixed}  返回所调用的函数的返回值
			 */
			callFunction: function(ref) {
				var fn = functions[ref];
				return fn && fn.apply(window, Array.prototype.slice.call(arguments, 1));
			},


			/**
			 * 把一个对象的属性复制到另一个对象，默认情况下不覆盖重名属性.
			 *
			 *         var myObject = {
			 *              prop1: true
			 *         };
			 *
			 *         MSeditor.utils.extend( myObject, {
			 *             prop2: true,
			 *             prop3: true
			 *         } );
			 *
			 *         for ( var p in myObject )
			 *             alert( p );
			 *
			 * @param  {Object} target 被扩张对象
			 * @param  {Boolean} overwrite 是否覆盖重名属性
			 * @param  {Object} properties 源对象
			 * 
			 * @return {Object}  扩展后的target对象
			 */
			extend: function(target, overwrite, properties) {
				for (var propertyName in properties) {
					if (overwrite === true || target[propertyName] == undefined) {
						target[propertyName] = properties[propertyName];
					}
				}
				return target;
			},


			/**
			 * 遍历给定的数组.
			 *
			 * @param  {Array} ar 需要遍历的数组
			 * @param  {Function} fn  fn函数将循环接受eachArray正在处理的数组元素，如果fn返回false，函数eachArray将停止循环
			 *
			 */
			eachArray: function(ar, fn) {
				if (this.isArray(ar)) {
					var obj;
					for (var i = 0; i < ar.length; i++) {
						obj = ar[i];
						if (fn) {
							obj = fn(obj);
							if (obj == false) {
								return;
							}
						}
					}
				}
			},


			/**
			 * 遍历dom树.
			 *
			 *     注意：函数将忽略空白文本节点
			 *
			 * @param  {HTMLElement}   node 开始的元素节点
			 * @param  {Function} fn   fn函数将循环接受eachTree正在处理的节点，如果fn返回false，函数eachTree将停止遍历dom树
			 * 
			 * @return {NodeList}      遍历得到的 NodeList
			 */
			eachTree: function(node, fn) {
				if (Dom.MSDoType(node) != 1) {
					return;
				}
				var child = node.childNodes,
					node = null,
					list = [];
				if (child && fn) {
					for (var i = 0; i < child.length; i++) {
						node = child[i];
						if (node.nodeType == 1 || (node.nodeType == 3 && node.length > 0)) {
							if (fn(node) == false) {
								return;
							} else {
								list.push(node);
							};
							if (node.childNodes) {
								arguments.callee(node, fn);
							}
						}
					}
					return list;
				}
			},


			/**
			 * 去除数组中的重复项.
			 *
			 * @param  {Array} arr 目标数组
			 * 
			 * @return {Array} 去掉重复项后的数组
			 */
			unique: function(arr) {
				var result = [],
					hash = {};
				for (var i = 0, elem;
					(elem = arr[i]) != null; i++) {
					if (!hash[elem]) {
						result.push(elem);
						hash[elem] = true;
					}
				}
				return result;
			},


			/**
			 * RGB颜色转换至16进制颜色.
			 * 
			 * @param  {Number} r 0-255的色值
			 * @param  {Number} g 0-255的色值
			 * @param  {Number} b 0-255的色值
			 * 
			 * @return {String} 16进制色值
			 */
			RGBtoHEX: function(r, g, b) {
				var hexStr = '0123456789abcdef',
					low,
					high,
					hex;
				// R
				low = r % 16;
				high = (r - low) / 16;
				hex = hexStr.charAt(high) + hexStr.charAt(low);
				// G
				low = g % 16;
				high = (g - low) / 16;
				hex += hexStr.charAt(high) + hexStr.charAt(low);
				// B
				low = b % 16;
				high = (b - low) / 16;
				hex += hexStr.charAt(high) + hexStr.charAt(low);
				return hex;
			},
			/**
			 * 补全16进制颜色.
			 */
			supHex: function(hex) {
				parseInt
				var hex = hex.replace(/[^\d|abcdef]/gi, "").substr(0, 6);
				if (hex.length < 6 && hex.length > 0) {
					if (hex.length > 2)
						hex += hex.substr(hex.length - 6);
					else
						hex = new Array(6 / hex.length + 1).join(hex);
				} else if (hex.length == 0) {
					hex = false;
				}
				return hex;
			},


			/**
			 * 16进制颜色转换至RGB颜色.
			 * 
			 * @param  {String} value 16进制色值
			 * 
			 * @return {Object}
			 * @return {Number} return.R  R值
			 * @return {Number} return.G  G值
			 * @return {Number} return.B  B值
			 */
			HEXtoRGB: function(value) {
				var value = this.supHex(value);
				if (!value) {
					return;
				}
				var r = parseInt(value.slice(0, 2), 16);
				var g = parseInt(value.slice(2, 4), 16);
				var b = parseInt(value.slice(4, 6), 16);
				return {
					'R': r,
					'G': g,
					'B': b
				}
			},


			/**
			 * HSB<a href="http://baike.baidu.com/link?url=FgdKOoEExS_H_d1TlUB8psJwvL9uzTxGfb8yc1ry5jnMadvs0uIXZMdGvyx06EZ5zlxKzRI6ODISSYnkpBC9DK" target="view_window">(详情)</a>模式转换至RGB.
			 *
			 * @param  {Number} H 色相值 0-360
			 * @param  {Number} S 饱和度 0-100
			 * @param  {Number} B 亮度   0-100
			 * 
			 * @return {Object}
			 * @return {Number} return.R  R值
			 * @return {Number} return.G  G值
			 * @return {Number} return.B  B值
			 */
			HSBtoRGB: function(H, S, B) {
				var r = 0,
					g = 0,
					b = 0;
				if (S == 0) {
					r = g = b = B;
				} else {
					var sectorPos = H / 60.0 % 6,
						sectorNumber = Math.floor(sectorPos),
						fractionalSector = sectorPos - sectorNumber,
						p = B * (1.0 - S),
						q = B * (1.0 - (S * fractionalSector)),
						t = B * (1.0 - (S * (1 - fractionalSector)));
					switch (sectorNumber) {
						case 0:
							r = B;
							g = t;
							b = p;
							break;
						case 1:
							r = q;
							g = B;
							b = p;
							break;
						case 2:
							r = p;
							g = B;
							b = t;
							break;
						case 3:
							r = p;
							g = q;
							b = B;
							break;
						case 4:
							r = t;
							g = p;
							b = B;
							break;
						case 5:
							r = B;
							g = p;
							b = q;
							break;
					}
				}
				return {
					'R': Math.round(r * 255.0),
					'G': Math.round(g * 255.0),
					'B': Math.round(b * 255.0)
				};
			},


			/**
			 * 判断给定对象是否是元素节点.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isElement: function(obj) {
				if (!!obj && typeof obj == 'object' && obj['nodeType'] && obj['nodeType'] == 1) {
					return obj.nodeName.toLowerCase();
				}
				return false;
			},
			/**
			 * 判断给定对象是否是文本节点.
			 *
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isText: function(obj) {
				if (!!obj && typeof obj == 'object' && obj['nodeType'] && obj['nodeType'] == 3) {
					return true;
				}
				return false;
			},


			/**
			 * 判断给定对象是否是数组.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isArray: function(obj) {
				return obj != null && typeof obj == "object" && 'splice' in obj && 'join' in obj;
			},


			/**
			 * 判断给定对象是否是函数.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isFunction: function(obj) {
				return typeof obj == "function";
			},


			/**
			 * 判断给定对象是否是字符串.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isString: function(obj) {
				return typeof obj == "string";
			},


			/**
			 * 判断给定对象是否是数字.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isNumber: function(obj) {
				return typeof obj == "number";
			},


			/**
			 * 判断给定对象是否是window对象.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isWindow: function(obj) {
				return obj != null && obj == obj.window;
			},
			/**
			 * 判断给定对象是否是 documet 对象.
			 * 
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isDocument: function(obj) {
				if (obj['nodeType']) {
					if (obj['nodeType'] == 9 && obj['getElementsByTagName']) {
						return true;
					}
				}
				return false;
			},


			/**
			 * 获取对象可枚举属性的数量.
			 *
			 * 		var oCar = new Object;
			 *		oCar.color = "blue";
			 *		oCar.doors = 4;
			 *		oCar.mpg = 25;
			 *		oCar.showColor = function() {
			 *		  alert(this.color);
			 *		};
			 *
			 * 		alert(MSeditor.utils.objectKeysLength(oCar)); // 4
			 *
			 * @param  {Object} obj 目标对象
			 * @return {Number}  属性数量
			 */
			objectKeysLength: function(obj) {
				if (Object.keys) {
					return Object.keys(obj).length;
				} else {
					var keysNum = 0;
					for (var i in obj) {
						keysNum++;
					}
					return keysNum;
				}
			},


			/**
			 * RGB转换至HSB模式.
			 * 
			 * @param  {Number} H 色相值  0-360
			 * @param  {Number} S 饱和度  0-100
			 * @param  {Number} B 亮度    0-100
			 * 
			 * @return {Object}
			 * @return {Number} return.R  R值
			 * @return {Number} return.G  G值
			 * @return {Number} return.B  B值
			 */
			RGBtoHSB: function(red, green, blue) {
				var r = parseInt(red) / 255.0;
				g = parseInt(green) / 255.0,
					b = parseInt(blue) / 255.0,
					max = Math.max(r, Math.max(g, b)),
					min = Math.min(r, Math.min(g, b)),
					h = 0;
				if (max == min) {
					h = 0
				} else if (max == r && g >= b) {
					h = 60 * (g - b) / (max - min);
				} else if (max == r && g < b) {
					h = 60 * (g - b) / (max - min) + 360;
				} else if (max == g) {
					h = 60 * (b - r) / (max - min) + 120;
				} else if (max == b) {
					h = 60 * (r - g) / (max - min) + 240;
				}
				var s = (max == 0) ? 0.0 : (1.0 - (min / max)),
					s = s.toFixed(2);
				b = max.toFixed(2);
				return {
					'H': +h,
					'S': +s,
					'B': +b
				};
			},
			/**
			 * 为给定的对象设置自定义属性，之后可以用 getCustomData 获取.
			 *
			 *     MSeditor.utils.setCustomData( document,'hasCustomData', true );
			 *     注意：当复制当前对象时对象的自定义属性将不会被复制
			 *
			 * @param {Object} obj 目标对象
			 * @param {String} key  用于识别的属性名称
			 * @param {Object} value 属性值
			 *
			 * @return {Mixed} 设置的属性值
			 */
			setCustomData: function(obj, key, value) {
				if (!obj[expandMs])
					obj[expandMs] = {};
				return obj[expandMs][key] = value;

			},


			/**
			 * 获取给定对象的自定义属性.
			 *
			 *     MSeditor.utils.setCustomData(document,'hasCustomData', 'myData' );
			 *     alert(MSeditor.utils.getCustomData(document,'hasCustomData')); // myData
			 *
			 * @param  {Object} obj 目标对象
			 * @param  {String} key 属性名称
			 * 
			 * @return {Mixed}  对应的值
			 */
			getCustomData: function(obj, key) {
				if (!obj[expandMs]) {
					obj[expandMs] = {};
					return null;
				}
				var customData = obj[expandMs][key];
				return customData ? customData : null;
			},


			/**
			 * 删除给定对象指定名称的自定义属性.
			 *
			 *     MSeditor.utils.setCustomData(document,'hasCustomData', 'myData' );
			 *     MSeditor.utils.removeCustomData(document,'hasCustomData' );
			 *     alert(MSeditor.utils.getCustomData(document,'hasCustomData')); // null
			 *     
			 * @param {Object} obj 目标对象   
			 * @param  {String} key 属性名称
			 */
			removeCustomData: function(obj, key) {
				var customData = obj[expandMs];
				if (customData && key in customData) {
					delete customData[key];
				}
			},


			/**
			 * 清除给定对象的所有自定义属性.
			 *
			 *     MSeditor.utils.setCustomData(document,'hasCustomData', 'myData' );
			 *     MSeditor.utils.setCustomData(document,'objType', '3' );
			 *     MSeditor.utils.clearCustomData();
			 *     alert(MSeditor.utils.getCustomData(document,'hasCustomData')); // null
			 *     alert(MSeditor.utils.getCustomData(document,'objType')); // null
			 *
			 * @param {Object} obj 目标对象   
			 */
			clearCustomData: function(obj) {
				var customData = obj[expandMs];
				customData && delete obj[expandMs];
			}

		}
	}();

	/**
	 * @class MSeditor.domUtils
	 * dom静态工具函数类
	 * @singleton
	 */
	MSeditor.domUtils = function() {

		return {
			/**
			 * 判断给定元素是否有子节点.
			 *
			 *    注意：函数将忽略空白文本节点和注释节点
			 *    
			 * @param  {HTMLElement} node 目标元素
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isEmpty: function(node) {
				// if (ignoreComment !== false) {
				// 	ignoreComment = true;
				// }
				var child = this.child(node);
				if (!child) {
					return true;
				} else {
					return false;
				}
			},
			/**
			 * 判断给定的对象是否是空白文本节点.
			 *
			 * @param  {Object} obj 目标对象
			 * 
			 * @return {Boolean} 返回一个布尔值
			 */
			isEmptyText: function(obj) {
				if ((obj['nodeType'] == 3 && obj.data.search(/\S/) < 0) || (typeof obj == 'string' && obj.search(/\S/) < 0)) {
					return true;
				} else {
					return false;
				}
			},
			/**
			 * 设置或返回元素的 HTML 内容.
			 *
			 * @param  {HTMLElement} element 目标元素
			 * @param  {HTMLText} content HTML文本
			 * @param  {Boolean} [join=false] 可选／设定 content 的添加方式,默认替换目标元素的 HTML 内容
			 *
			 * @return {String} HTML 内容
			 */
			html: function(element, content, join) {
				if (content == undefined) {
					return element.innerHTML;
				} else {
					if (join === true) {
						element.innerHTML += content;
					} else if (!join) {
						element.innerHTML = content;
					}
					return this.html(element);
				};
			},
			/**
			 * 删除元素所有子节点.
			 *
			 * @param  {HTMLElement/NodeList} element 目标元素
			 */
			empty: function(element) {
				if (element['length']) {
					for (var i in element) {
						arguments.callee(element[i]);
					}
				} else if (element.nodeType == 1) {
					element.innerHTML = '';
				}
			},
			/**
			 * 设置或返回元素的文本.
			 *
			 * @param {DOMNode} element 目标节点
			 * 
			 * @return {String} 节点及其后代的文本
			 */
			text: function(element, content) {
				if (content) {
					content = content.replace(/&/g, '&#38;').replace(/</g, '&#60;').replace(/>/g, '&#62;');
					element.innerHTML = content;
				}


				return element.textContent || element.innerText || '';
			},
			/**
			 * 为元素批量添加或改变指定属性.
			 *                  
			 *                  MSeditor.dom.utils.setAttr(someElement,{
			 *                             'id':'myBody',
			 *                             'class':'myBodyClass'
			 *                  });
			 *                  alert(someElement.id); // myBody
			 *
			 * @param {HTMLElement} element  目标元素
			 * @param {Object} name  以属性名和值组成的对象
			 *
			 */
			setAttr: function(element, name) {
				for (var i in name) {
					if (i == 'class') {
						element.className = name[i];
					} else {
						element.setAttribute(i, name[i])
					}
				}
			},
			/**
			 * 从元素中移除单个或多个属性.
			 *
			 *                  MSeditor.dom.utils.removeAttr(someElement,['class','id']);
			 *					 MSeditor.dom.utils.removeAttr(someElement,'style');
			 *                  alert(someElement.id); // null
			 *
			 * @param {HTMLElement} element  目标元素
			 * @param {Array/String} name  单个属性名或以属性名组成的数组
			 *
			 */
			removeAttr: function(element, name) {
				if (typeof name == 'string') {
					element.hasOwnProperty(name) && element.removeAttribute(name);
					return;
				}
				if (name['length']) {
					for (var i in name) {
						arguments.callee(name[i]);
					}
				}
			},
			/**
			 * 遍历节点的子元素集合.
			 *
			 * @param  {Document/HTMLElement} node 目标元素
			 * @param  {Function} selectorFn  可选/一个筛选函数.
			 * 如果给定selectorFn函数，child将子元素逐个传给 selectorFn，并根据 selectorFn 是否返回布尔值 true 来确定最后返回的子元素列表，如果 selectorFn 返回 false 将直接返回之前得到的子元素列表
			 * 
			 * @return {NodeList/null}  如果有子节点将返回包含子节点的 NodeList，反之返回null
			 * 
			 *      注意：函数将忽略空白文本节点
			 */
			child: function(node, selectorFn) {
				var child = [],
					utils = MSeditor.utils,
					cn = node.childNodes;
				if (cn.length) {
					for (var i = 0; i < cn.length; i++) {
						if (this.isEmptyText(cn[i])) {
							continue;
						}
						if (selectorFn) {
							var selector = selectorFn(cn[i])
							if (selector === false) {
								break;
							} else if (selector === true) {
								child.push(cn[i]);
							}
						} else {
							child.push(cn[i]);
						}
					}
				}
				if (child.length > 0) {
					return child;
				}
				return null;
			},
			/**
			 * 添加或获取元素样式.
			 *     
			 *                  MSeditor.dom.utils.css(element,'background','red');
			 *                  MSeditor.dom.utils.css(element,{
			 *                             'borderTop':'10px',
			 *                             'display':'none'
			 *                  });
			 *                  alert(MSeditor.dom.utils.css(element,'background'));
			 *                  MSeditor.dom.utils.css(element,'background')); 
			 *
			 * @param {HTMLElement} 	element  	目标元素
			 * @param {String/Object} 	key  		样式属性名或以属性名和值组成的对象，如果给定的是属性名且参数 value 为空时函数将返回元素指定的属性值
			 * @param {String} 			value  		把参数 key 中指定的属性设置为 value 的值，如果参数key是一个 Object 那么参数 value 将被忽略
			 *
			 * @return {String/null}  参数 key 中指定的属性的值
			 *
			 */
			css: function(element, key, value) {
				if (value === undefined && typeof key == "string") {
					var styleValue = element.style[key];
					return styleValue ? styleValue : null;
				} else if (typeof key == "string") {
					element.style[key] = value;
				} else {
					for (var i in key) {
						element.style[i] = key[i];
					}
				}
			},
			/**
			 * 设置元素的样式属性.
			 * @param {HTMLElement} element  目标元素
			 * @param  {String} content  css 内联样式文本
			 * @param  {Boolean} [replace=false] 可选／是否追加，默认为替换
			 * 
			 */
			cssText: function(elemengt, content, replace) {
				if (elemengt.nodeType == 1) {
					if (replace === true) {
						elemengt.style.cssText = content;
					} else {
						elemengt.style.cssText += content;
					}
				}
			},
			/*
			 * 获取元素视图属性.
			 *
			 * @param  {String ['']} limits
			 * 可选/如果给定参数将根据参数返回一个包含元素高度和宽度值的对象，反之将返回包含元素所有的高度、宽度值的对象
			 * @param limits.outer
			 * 获取元素包括 padding 和 border 的高度、宽度值
			 *
			 *        var size=MSeditor.dom.utils._viewSize(element,'outer'); //return Object
			 *        alert(size.height +'/'+ size.width);
			 *
			 * @param limits.inner
			 * 获取元素包括 padding 的高度、宽度值
			 *
			 *        var size=MSeditor.dom.utils._viewSize(element,'inner'); //return Object
			 *        alert(size.height +'/'+ size.width);
			 *
			 * @param limits.core
			 * 获取元素不包括 padding 和 border 的高度、宽度值
			 *
			 *        var size=MSeditor.dom.utils._viewSize(element,'core'); //return Object
			 *        alert(size.height +'/'+ size.width);
			 *
			 * @param limits.hidden
			 * 获取元素隐藏部分的高度、宽度值
			 *
			 *        var size=MSeditor.dom.utils._viewSize(element,'hidden'); //return Object
			 *        alert(size.height +'/'+ size.width);
			 *
			 * @return {Object}
			 * 包含元素高度和宽度值的对象
			 */
			_viewSize: function(element, limits) {
				var size = {},
					$ = element,
					styleText = this.attr('style');
				this.css($, 'overflow', 'hidden');
				if (!limits || limits == 'inner') {
					if (limits) {
						size = {
							'height': $.clientHeight,
							'width': $.clientWidth
						};
					} else {
						size.innerHeight = $.clientHeight;
						size.innerWidth = $.clientWidth;
					}


				}


				if (!limits || limits == 'outer') {
					if (limits) {
						size = {
							'height': $.offsetHeight,
							'width': $.offsetWidth
						};
					} else {
						size.outerHeight = $.offsetHeight;
						size.outerWidth = $.offsetWidth;
					}


				}


				if (!limits || limits == 'hidden') {
					var top = $.scrollTop,
						left = $.scrollLeft;
					$.scrollTop = $.scrollLeft = 100000;
					if (limits) {
						size = {
							'height': $.scrollTop,
							'width': $.scrollLeft
						};
					} else {
						size.hiddenHeight = $.scrollTop;
						size.hiddenWidth = $.scrollLeft;
					}


					$.scrollTop = top;
					$.scrollLeft = left;
				}
				this.css(element, 'padding', 0);
				if (!limits || limits == 'core') {
					if (limits) {
						size = {
							'height': $.clientHeight,
							'width': $.clientWidth
						};
					} else {
						size.height = $.clientHeight;
						size.width = $.clientWidth;
					}


				}
				styleText != '' && $.style.cssText(styleText);
				return size;
			},


			/**
			 * 获取元素不包括 padding 和 border 的高度值.
			 * 
			 *       alert(MSeditor.dom.utils.height(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 高度值
			 */
			height: function(element) {
				return this._viewSize(element, 'core').height;
			},


			/**
			 * 获取元素不包括 padding 和 border 的宽度值.
			 *
			 *       alert(MSeditor.dom.utils.width(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * @return {Number} 宽度值
			 */
			width: function(element) {
				return this._viewSize(element, 'core').width;
			},


			/**
			 * 获取元素包括 padding 的高度值.
			 *
			 *       alert(MSeditor.dom.utils.innerHeight(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 高度值
			 */
			innerHeight: function(element) {
				return this._viewSize(element, 'inner').height;
			},


			/**
			 * 获取元素包括 padding 的宽度值.
			 *
			 *       alert(MSeditor.dom.utils.innerWidth(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 宽度值
			 */
			innerWidth: function(element) {
				return this._viewSize(element, 'inner').width;
			},


			/**
			 * 获取元素包括 padding 和 border 的高度值.
			 * 
			 *       alert(MSeditor.dom.utils.outerHeight(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * @return {Number} 高度值
			 */
			outerHeight: function(element) {
				return this._viewSize(element, 'outer').height;
			},


			/**
			 * 获取元素包括 padding 和 border 的宽度值.
			 *
			 *       alert(MSeditor.dom.utils.outerWidth(element)) // 300
			 *
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 宽度值
			 */
			outerWidth: function(element) {
				return this._viewSize(element, 'outer').width;
			},


			/**
			 * 获取元素隐藏部分的高度值.
			 * 
			 *       alert(MSeditor.dom.utils.hiddenHeight(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 高度值
			 */
			hiddenHeight: function(element) {
				return this._viewSize(element, 'hidden').height;
			},


			/**
			 * 获取元素隐藏部分的宽度值.
			 *
			 *       alert(MSeditor.dom.utils.hiddenWidth(element)) // 300
			 *       
			 * @param {HTMLElement} element 目标元素
			 * 
			 * @return {Number} 宽度值
			 */
			hiddenWidth: function(element) {
				return this._viewSize(element, 'hidden').width;
			},


			/**
			 * 向下查找指定名称的元素
			 * @param  {DOMNode} parentNode 目标节点
			 * @param  {String} tagName   查找的标签名
			 * @return {NodeList/null}   
			 */
			getByTag: function(parentNode, tagName) {
				if (!parentNode) {
					parentNode = document;
				}
				var nodes = parentNode.getElementsByTagName(tagName);
				return nodes.length ? nodes : null;
			},


			/**
			 * 把节点 elementA 添加到 elementB 子节点列表的开头或结尾处.
			 * 
			 * @param {HTMLElement／TextNode/NodeList/HTMLText} elementA  要追加的节点
			 * @param {DOMNode} elementB 目标节点
			 *
			 * @param {Boolean} [toStart=false] 可选/指定把追加的子节点添加在当前节点的开头还是末尾.
			 * @param toStart.true 添加在开头
			 * @param toStart.false 默认/添加在末尾
			 *
			 * @return {DOMNode/null} 如果插入成功将返回插入的元素，反之 null
			 */
			append: function(elementA, elementB, toStart) {
				if (elementB.nodeType == 1 || elementB.nodeType == 11) {
					if (typeof elementA == 'string') {
						elementA = this.HTMLToNode(elementA, this.getDocument(elementB));
						if (!elementA) {
							return null;
						}
					}
					var firstChild = this.firstChild(elementB),
						appendNode;
					if (!firstChild || !toStart) {
						//如果是元素列表,添加到文档碎片中
						if (elementA['length']) {
							var docFragment = this.getDocument(elementB).createDocumentFragment();
							for (var i = 0; i < elementA['length']; i++) {
								docFragment.appendChild(elementA[i]);
							}
							appendNode = MSeditor.utils.makeArray(docFragment.childNodes);
							elementB.appendChild(docFragment);
						} else {
							appendNode = elementB.appendChild(elementA);
						}


					} else {
						//如果是添加到开头
						appendNode = this.before(elementA, firstChild);
					}
					return appendNode ? appendNode : null;
				}
			},
			/**
			 * 将节点 nodeA 插入到节点 nodeB 之前.
			 * 
			 * @param {HTMLElement/NodeList/HTMLText/TextNode} nodeA 添加的节点
			 * @param {DOMNode} nodeB 目标节点
			 *
			 * @return {DOMNode/null} 如果插入成功将返回插入的元素，反之 null
			 */
			before: function(nodeA, nodeB) {
				if (typeof nodeA == 'string') {
					nodeA = this.HTMLToNode(nodeA, this.getDocument(nodeB));
					if (!nodeA) {
						return null;
					}
				}
				var appendNode;
				if (nodeA['length']) {
					var docFragment = document.createDocumentFragment();
					for (var i = 0; i < nodeA.length; i++) {
						docFragment.appendChild(nodeA[i]);
					}
					appendNode = MSeditor.utils.makeArray(docFragment.childNodes);
					nodeB.parentNode.insertBefore(docFragment, nodeB);

				} else {
					appendNode = nodeB.parentNode.insertBefore(nodeA, nodeB);
				}

				return appendNode;
			},


			/**
			 *
			 * 把 nodeA 节点 添加到 nodeB 节点之后.
			 *
			 * @param {HTMLElement／TextNode/NodeList/HTMLText} nodeA 要追加的节点
			 * @param {DOMNode} nodeB 目标节点
			 *
			 * @return {DOMNode/null} 如果插入成功将返回插入的元素，反之 null
			 */
			after: function(nodeA, nodeB) {
				var nextNode = this.next(nodeB);
				if (nextNode) {
					return this.before(nodeA, nextNode);
				} else {
					var parentNode = this.parent();
					if (parentNode) {
						return this.append(nodeA, parentNode);
					}
				}
			},


			// 返回 node 之前或之后的所有兄弟节点
			_siblingNode: function(node, direction, fn) {
				var parentNode = node.parentNode,
					child,
					siblingNodes = [];
				if (!parentNode) {
					return null;
				};
				var child = parentNode.childNodes;
				if (child.length > 1) {
					if (!!direction) {
						direction = 'nextSibling';
					} else if (!direction) {
						direction = 'previousSibling';
					}

					while (node) {
						node = node[direction];
						if (node && node.nodeType == 1 || (node.nodeType == 3 && !this.isEmptyText(node))) {
							if (fn && fn(node) === false) {
								break;
							}
							siblingNodes.push(node);
						}
					}
				}


				return siblingNodes.length ? siblingNodes : null;
			},
			/**
			 * 获取节点 node 后面紧邻的兄弟节点.
			 *
			 *        注意:次方法将忽略空白文本节点以及注释节点
			 *        
			 * @param {DOMNode} node 目标节点     
			 *    
			 * @return {DOMNode/null} 如果有将返回一个 DOM 节点
			 */
			next: function(node) {
				var nextNode = null;
				this.nextAll(node, function(ele) {
					if (ele) {
						nextNode = ele;
					}
					return false;
				});
				return nextNode;
			},
			/**
			 * 获取 node 节点之后的所有兄弟节点.
			 *
			 *        注意:次方法将忽略空白文本节点以及注释节点
			 *        
			 * @param {DOMNode} node 目标节点   
			 * @param {Function} selectorFn 可选/一个筛选函数.
			 * 如果给定 selectorFn 参数，函数将获取到兄弟节点逐个传给 selectorFn函数，并根据 selectorFn 是否返回布尔值 true 来确定最后返回的节点列表，如果 selectorFn 返回 false 将直接返回之前得到的节点列表	 
			 * 
			 * @return {Array/null} 一个包含节点之后所有兄弟节点的数组,如果没有兄弟节点将返回 null
			 */
			nextAll: function(node, selectorFn) {
				var nextNodes = this._siblingNode(node, true, selectorFn);
				return nextNodes;


			},
			/**
			 * 获取 node 节点之前紧邻的兄弟节点.
			 *
			 *        注意:次方法将忽略空白文本节点以及注释节点
			 *        
			 * @param {DOMNode} node 目标节点   
			 * 
			 * @return {DOMNode/null} 如果有将返回一个 DOM 节点
			 */
			prev: function(node) {
				var prevNode = null;
				this._siblingNode(node, false, function(ele) {
					if (ele) {
						prevNode = ele;
					}
					return false;
				});
				return prevNode;
			},
			/**
			 * 获取 node 节点之前的所有兄弟节点.
			 *
			 *        注意:次方法将忽略空白文本节点以及注释节点
			 *        
			 * @param {DOMNode} node 目标节点   
			 * @param {Function} selectorFn 可选/一个筛选函数.
			 * 如果给定 selectorFn 参数，函数将获取到兄弟节点逐个传给 selectorFn函数，并根据 selectorFn 是否返回布尔值 true 来确定最后返回的节点列表，如果 selectorFn 返回 false 将直接返回之前得到的节点列表	 
			 *    
			 *  
			 * @return {Array/null} 一个包含节点之前所有兄弟节点的数组,如果没有兄弟节点将返回 null
			 */
			prevAll: function(node, selectorFn) {
				var prevNodes = this._siblingNode(node, true, selectorFn);
				return prevNodes;
			},
			/**
			 * 添加或替换元素的类名.
			 * 
			 * @param {HTMLElement} element  目标元素
			 * @param {String} className    添加的类名,如果是多个请用逗号隔开，例如 classA,classB
			 * @param {String} replaceClass 可选／替换的类名，用 replaceClass 替换目标元素类名中的 className
			 * 
			 */
			addClass: function(element, className, replaceClass) {
				if (className) {
					className = className.replace(/^ *| *$/g, '').replace(/ /g, '|').split(',');
					if (className.length > 1) {
						for (var i = 0; i < className.length; i++) {
							this.addClass(element, className[i], replaceClass);
						}
						return;
					} else {
						className = className[0];
					}


					classRegex = new RegExp('/ *' + className + '/g');

					//如果是添加模式
					if (typeof replaceClass == 'undefined' && !this.hasClass(element, className)) {
						element.className += ' ' + className;
					} else if (this.hasClass(element, className)) {
						element.className = element.className.replace(classRegex, replaceClass.replace(/ /g, ''));
					}
				}
				return element.className;


			},
			/**
			 * 检查元素是否拥有指定的类名.
			 * 
			 * @param {HTMLElement} element  目标元素
			 * @param {String} className   检查的类名
			 *
			 * @return {Boolean} 如果有返回 true ，反之 false
			 * 
			 */
			hasClass: function(element, className) {
				className = className.replace(/^ *| *$/g, '');
				var classRegex = new RegExp('/' + className + '/g');
				return classRegex.test(element.className);
			},
			/**
			 * 获取当前节点所有父辈元素.
			 * 
			 * @param {DOMNode} node 目标节点   
			 * @param {Function} selectorFn 可选/一个筛选函数.
			 * 如果给定 selectorFn 参数，函数将获取到兄弟节点逐个传给 selectorFn函数，并根据 selectorFn 是否返回布尔值 true 来确定最后返回的节点列表，如果 selectorFn 返回 false 将直接返回之前得到的节点列表	 
			 *    
			 *  
			 * @return {Array/null} 一个包含节点所有父节点的数组,如果没有将返回 null
			 */
			parentAll: function(node, selectorFn) {
				var parentNode = node.parentNode,
					nodeList = [],
					returnsMsg;
				while (parentNode) {
					if (selectorFn) {
						returnsMsg = selectorFn(parentNode);
						if (returnsMsg == false) {
							break;
						}
					}
					nodeList.push(parentNode);
					parentNode = parentNode.parentNode;
				}
				if (!nodeList.length) {
					nodeList = null;
				}
				return nodeList;
			},


			/**
			 * 删除当前节点.
			 * @param  {HTMLElement} node 目标元素 
			 * @param  {Boolean} [retainChildren=false] 
			 * 可选/如果为 true 将保留子元素，默认为false
			 * 
			 * @return {NodeList} 如果保留子节点那么将返回包含所有子节点的节点列表
			 *
			 */
			removeNode: function(node, retainChildren) {
				var parent = node.parentNode;
				if (!parent) return;


				if (!retainChildren) {
					parent.removeChild(node);
				} else {
					var child = node.childNodes;
					if (child.length > 0) {
						this.before(child)
						parent.removeChild(node);
					}
					return child;
				}


			},
			/**
			 * 用指定的元素包裹当前节点.
			 * 
			 * 
			 * @param {DOMNode} node 目标节点
			 * @param  {HTMLText/HTMLElement} wrapper 要包裹目标节点的元素或者一个 HTML 文本
			 * 如果 wrapper 是节点列表，那么用列表的首个元素包裹目标节点
			 * 如果 wrapper 是一个存在于文档的元素，那么函数将用元素的副本包裹目标节点
			 * 
			 * @return {HTMLElement/null} 如果成功将返回包裹的元素，反之 null
			 */
			wrap: function(node, wrapper) {
				var wrapNode = null;
				if (typeof wrapper == 'string') {
					wrapNode = this.HTMLToNode(wrapper, this.getDocument(node));
					if (wrapNode['length']) {
						wrapNode = wrapNode[0];
					}
				} else {
					wrapNode = wrapper;
				}


				if (wrapNode && wrapNode.nodeType == 1) {
					wrapNode = this.cloneNode(wrapNode);
					this.before(node, wrapNode);
					this.append(wrapNode, node);
				} else {
					wrapNode = null;
				}
				return wrapNode;
			},
			/**
			 * 创建节点或节点列表的副本.
			 *
			 * @param {DOMNode/NodeList} node 目标节点  
			 * @param {Boolean} [includeAll=false] 可选／如果这个布尔参数设置为 true，被克隆的节点会复制原始节点的所有子节点，默认为 false
			 * 
			 * @return {DOMNode/Array} 节点或节点列表的副本
			 */
			cloneNode: function(node, includeAll) {
				var newNode;
				if (node.nodeType == 1) {
					newNode = node.cloneNode(includeAll);
				} else if (node.nodeType == 3) {
					newNode = document.createTextNode(node.data);
				} else {
					//如果是列表
					newNode = [];
					for (var i in node) {
						newNode.push(arguments.callee(node[i], includeAll));
					}
				}
				return newNode;
			},


			/**
			 * 返回元素 node 最后一个子节点.
			 * 
			 *             注意:次方法将忽略空白文本节点以及注释节点
			 *             
			 * @param {Document/HTMLElement} node 目标元素
			 * 
			 * @return {DOMNode/null} 元素最后一个子节点或 null
			 *  
			 */
			lastChild: function(node) {
				var last = node.childNodes;
				if (last) {
					//颠倒列表
					last = Array.prototype.reverse.call(last);
					for (var i in last) {
						if (last[i].nodeType == 1 || (last[i].nodeType == 3 && !this.isEmptyText(last[i]))) {
							return last[i];
						}
					}
				}
				return null;
			},


			/**
			 * 返回元素 node 第一个子节点.
			 * @param {Document/HTMLElement} node 目标元素
			 * 
			 * @return {DOMNode/null} 元素第一个子节点或 null
			 * 
			 *             注意:次方法将忽略空白文本节点以及注释节点
			 */
			firstChild: function(node) {
				var firstChild = node.childNodes;
				if (firstChild.length) {

					for (var i = 0; i < firstChild.length; i++) {
						if (firstChild[i].nodeType == 1 || (firstChild[i].nodeType == 3 && !this.isEmptyText(firstChild[i]))) {
							return firstChild[i];
						}
					}
				}
				return null;
			},
			/**
			 * 获取节点的小写 nodeName 	
			 *
			 * @param  {DOMNode} node 目标节点
			 * 
			 * @return {String} 小写的节点名称
			 */
			getName: function(node) {
				return node.nodeName.toLocaleLowerCase();
			},
			/**
			 * 用 nodeB 节点替换 nodeA 节点.
			 * 
			 * @param {DOMNode} nodeA 目标元素  
			 * @param {DOMNode／HTMLText} nodeB 要替换 nodeA 的节点
			 * 如果 nodeB 是一个存在于文档的元素，那么函数将用元素的副本包裹目标节点
			 * 
			 * @return {DOMNode/Array} 替换后的节点,如果 nodeA 是节点列表那么将返回一个数组
			 */
			replace: function(nodeA, nodeB) {
				var me = this;
				if (nodeB['nodeType'] < 4) {
					nodeB = this.cloneNode(nodeB);
				}


				if (typeof nodeB == 'string') {
					nodeB = this.HTMLToNode(nodeB);
				}
				if (nodeA['length']) {
					var replaceNodes = [];
					MSeditor.utils.eachArray(nodeA, function(ele) {
						replaceNodes.push(me.replace(ele, nodeB));
					})
					return replaceNodes;
				} else {
					this.before(nodeA, nodeB);
					this.removeNode(nodeA);
				}


				return nodeB;
			},
			/**
			 * 为当前对象绑定一个或多个事件处理函数.
			 *
			 *     
			 *     MSeditor.dom.utils.bind(element,click,function(){
			 *         alert(this.nodeName); //body ，因为回调函数的作用域指向了body
			 *     },element;
			 *
			 *     MSeditor.dom.utils.bind(element,mousedown,function(ev){
			 *         alert(ev.type); //mousedown
			 *     },element);
			 *
			 *     function showName (ar1,ar2){
			 *         javaScript......
			 *     }
			 *
			 *     MSeditor.dom.utils.bind(element,mouseout,function(ev){
			 *         showName (ar1,ar2);
			 *     });
			 *
			 *     MSeditor.dom.utils.bind(element,focus,function(ev){
			 *         alert('focus');
			 *         this.unbind(element,focus,arguments.callee); //卸载绑定的focus事件
			 *     });
			 *
			 * @param  {DOMNode} node 目标节点
			 * @param  {String} eventName 一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'，如果事件名称是多个时用空格分隔，事件的命名空间用'.'在名称后面连接，值得注意的是带命名空间的事件在触发是运行的效率将高于普通绑定的事件
			 * @param  {Function} handler   事件发生时运行的回调函数，回调函数将自动接收一个MSeditor.Dom.event对象
			 * @param  {Object} scopeObj  可选/回调函数的作用域，如果设定了该参数那么在运行回调函数是回调函数的作用域将指向给定的对象，如果省略作用域将指向当前对象
			 *
			 * 		注意：如果相同的回调函数、作用域已经在存在于正在绑定的事件名下，那么回调函数的运行顺序将改变
			 */
			_eventNameFormat: function(eventName) {
				var eventName = eventName.replace(/^ *| *$/g, '');
				//如果是全局命名空间

				if (/([a-z]+ ){2,}\.[\S]+$/i.test(eventName)) {
					var space;
					eventName = eventName.replace(/\.[\S]+$/, function(s) {
						space = s;
						return '';
					}).replace(/([a-z]+)\b/g, '$1' + space);
				} else {
					eventName = eventName.replace(/ (\.[^ ]+)/g, '$1');
				}
				return eventName;
			},
			/**
				 *  为当前对象绑定一个或多个事件处理函数.
				 *
				 *      var doc=MSeditor.Dom(document);
				 *      doc.bind(click,function(){
				 *          alert(this.objType); // 9
				 *      });
				 *
				 *      var bodyElement=MSeditor.Dom(document.body);
				 *      bodyElement.bind(click,function(){
				 *          alert(this.nodeName); //body ，因为回调函数的作用域指向了body
				 *      },document.body);
				 *
				 *      bodyElement.bind(mousedown,function(ev){
				 *          alert(ev.type); //mousedown
				 *      },document.body);
				 *
				 *      function showName (ar1,ar2){
				 *          javaScript......
				 *      }
				 *
				 *      bodyElement.bind(mouseout,function(ev){
				 *          showName (ar1,ar2);
				 *      });
				 *
				 *      bodyElement.bind(focus,function(ev){
				 *          alert('focus');
				 *          this.unbind(focus,arguments.callee); //卸载绑定的focus事件
				 *      });
				 * @param  {DOMNode} node 目标节点
				 * @param  {String} eventName 一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'，如果事件名称是多个时用空格分隔，事件的命名空间用'.'在名称后面连接，值得注意的是带命名空间的事件在触发是运行的效率将高于普通绑定的事件
				 * @param  {Function} handler   事件发生时运行的回调函数，回调函数将自动接收一个MSeditor.Dom.event对象
				 * @param  {Object} scopeObj  可选/回调函数的作用域，如果设定了该参数那么在运行回调函数是回调函数的作用域将指向给定的对象，如果省略作用域将指向当前对象
				 *
				 * 		注意：如果相同的回调函数、作用域已经在存在于正在绑定的事件名下，那么回调函数的运行顺序将改变
				 */
			bind: function(node, eventName, handler, scopeObj) {
				eventName = this._eventNameFormat(eventName);
				//分割事件名
				var eventList = eventName.split(' ');
				//是不是一次绑定多个事件
				if (eventList.length > 1) {
					//如果是多个事件名，就生成事件名数组
					var k = -1;
					while (k++, eventList[k]) {
						this.bind(node, eventList[k], handler, scopeObj);
					}
					return;
				}
				eventName = eventName.replace(/^on/i, '').toLowerCase();
				scopeObj = scopeObj || node;
				//是否为事件设定一个命名空间
				var eventName = eventName.split('.'),
					space = eventName[1],
					eventName = eventName[0],
					//整个当前对象的事件函数都在events对象下，如果没有将建立一个
					nodeEvents = MSeditor.utils.getCustomData(node, 'eventHandlers') || MSeditor.utils.setCustomData(node, 'eventHandlers', {});
				/*
				对象的eventHandlers结构
				'eventName':{
								handlers: 	[]
								scope: 		[]
								space: 		{'spaceName':[]}
							}
				 */

				//要绑定的事件
				var addEvent = nodeEvents[eventName];
				//如果当前事件名称是第一次绑定
				if (!addEvent) {
					addEvent = nodeEvents[eventName] = {};
					//事件触发时运行的函数
					addEvent['handlers'] = [handler];
					addEvent['scope'] = [scopeObj];
					addEvent['nameSpace'] = addEvent['nameSpace'] ? {space: [0]} : {};

					//绑定在对象上的真正函数
					//realEv为触发事件时浏览器给的元素event对象
					function realHandler(realEv) {
						this;
						for (var i = 0; i < addEvent['handlers'].length; i++) {
							addEvent['handlers'][i].call(addEvent['scope'][i], realEv);
						}

					};
					//realHandler的一个指针，为了后面卸载事件时使用
					addEvent['realHandler'] = realHandler;

					//绑定事件
					if (node.addEventListener) {
						node.addEventListener(eventName, realHandler, false);
					} else if (node.attachEvent) {
						node.attachEvent("on" + eventName, realHandler);
					} else {
						node['on' + eventName] = realHandler;
					}
				} else {
					for (var i = 0; i < addEvent['handlers'].length; i++) {
						if (addEvent['handlers'][i] === handler) {
							return;
						}
					}
					addEvent['handlers'].push(handler);
					addEvent['scope'].push(scopeObj);
					addEvent['nameSpace'][space].push(addEvent['handlers'].length - 1);
				}
			},


			/**
			 * 为对象绑定一个一次性事件函数.
			 * 
			 * @param  {DOMNode} node 目标节点
			 * @param  {String} eventName 一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'
			 * @param  {Function} handler   事件发生时运行的回调函数，回调函数将自动接收一个MSeditor.Dom.event对象
			 * @param  {Object} scopeObj  可选/回调函数的作用域，如果设定了该参数那么在运行回调函数是回调函数的作用域将指向给定的对象，如果省略作用域将指向当前对象
			 *
			 * 		注意：如果给定的eventName有命名空间，once将忽略该命名空间
			 *
			 */
			once: function(node, eventName, handler, scopeObj) {

				//是不是一次绑定多个事件
				if (eventName.split(' ').length > 1) {
					//如果是多个事件名，就生成事件名数组
					var eventList = eventName.split(' '),
						k = -1;
					while (k++, eventList[k]) {
						arguments.callee(node, eventList[k], handler, scopeObj);
					}
					return;
				}
				//删除命名空间
				eventName = eventName.replace(/\..*?( |$)/g, ' ');
				var me = this;
				this.bind(node, eventName, function(ev) {
					handler(ev);
					me.unbind(node, eventName, this);
				}, scopeObj);
			},


			//存储 bind 和 unBind 函数运行时用到的元素的 eventHandlers
			_eventBag: '',
			/**
			 * 卸载绑定在对象上的事件函数.
			 *
			 * 		function showName (ar1,ar2){
			 *	         javaScript......
			 *	    }
			 *   	MSeditor.dom.utils.bind(element,'focus',showName);
			 *   	MSeditor.dom.utils.unbind(element,'focus',showName); //卸载绑定的focus事件
			 *
			 * 		MSeditor.dom.utils.bind(element,'focus.myevent',showName);
			 * 		MSeditor.dom.utils.unbind(element,'focus.myevent'); //把用指定名称的事件函数卸载
			 *
			 * 		MSeditor.dom.utils.unbind(element);//卸载所有事件
			 *
			 * 		MSeditor.dom.utils.unbind(element,'focus click mousedown.myevent'); //卸载对象的focus和click事件以及卸载mousedown事件的myevent回调函数
			 *
			 * 		MSeditor.dom.utils.unbind(element,showName);//卸载所有事件下的showName函数
			 * 		
			 * @param  {DOMNode} node 目标节点
			 * @param  {String} eventName 可选/一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'，如果事件名称是多个时用空格分隔，事件的命名空间用'.'在名称后面连接
			 * @param  {Function} handler 可选/绑定的事件函数
			 *
			 * 		注意：如果只给定eventName参数，那么unbind将卸载所有类型为eventName的事件函数，
			 * 		反之只给定handler参数的话将卸载所有事件类型下的handler函数
			 * 		而如果不给定任何参数，那么unbind将卸载该对象上绑定的所有事件对象
			 *
			 */
			unbind: function(node, eventName, handler) {
				if (!MSeditor.utils.isElement(node)) {
					return;
				}
				var eventBag;
				// addEvent['handlers']  
				// addEvent['scope']  
				// addEvent['nameSpace']
				// addEvent['realHandler']
				if (!this['_eventBag']) {
					eventBag = this['_eventBag'] = MSeditor.utils.getCustomData(node, 'eventHandlers');
					//如果没有绑定过任何事件
					if (!eventBag) {
						return;
					}
				} else {
					eventBag = this['_eventBag'];
				}
				//如果是删除元素上绑定的所有事件
				if (arguments.length == 1) {
					for (var k in eventBag) {
						arguments.callee(node, eventBag[k]);
					}
				} else {
					eventName = this._eventNameFormat(eventName);
					//判断一下是否是多个事件名
					if (eventName.search(/ /) > -1) {
						var eventList = eventName.split(' ');
						for (var i = 0; i < eventList.length; i++) {
							arguments.callee(node, eventList[i], handler);
						}
						return;
					}

					//分割一下，看看有没有命名空间
					var space = eventName.split('.'),
					targetEvent = eventBag[space[0]],
					space = space[1];
					//target 目标事件
					//事件列表中没有目标事件
					if (!targetEvent) {
						return;
					}
					//如果有命名空间将忽略函数
					//还有一种可能是带命名空间和函数，那么命名空间优先
					//到这儿就只有只带事件名、事件名加命名空间，事件名加函数
					if (space) {
						var spaceValue = targetEvent['nameSpace'][space];
						if (spaceValue && spaceValue.length) {
							for (var i = 0; i < spaceValue.length; i++) {
								//把函数和上下文都删除
								targetEvent['handlers'].splice(i, 1);
								targetEvent['scope'].splice(i, 1);
							}
						}

					} else if (handler) {
						var handlerList = targetEvent['handlers'];
						for (var i = 0; i < handlerList.length; i++) {
							if (handlerList[i] == handler) {
								handlerList.splice(i, 1);
								targetEvent['scope'].splice(i, 1);
								break;
							}
						}
					} else {
						// 没有命名空间，没有指定卸载的函数
						targetEvent['handlers'] = [];
					}
					//如果函数列表是空的话接着卸载事件
					if (targetEvent['handlers'].length) {
						this['_eventBag'] = '';
						return;
					}

					if (node.removeEventListener) {
						node.removeEventListener(eventName, targetEvent.realHandler, false);
					} else if (node.detachEvent) {
						node.detachEvent("on" + eventName, targetEvent.realHandler);
					} else {
						node["on" + eventName] = null;
					}
					delete eventBag[eventName];
					this['_eventBag'] = '';
				}

			},
			/**
			 * 获取节点关联的window对象.
			 * 
			 * @param {DOMNode} node 目标节点
			 *
			 * @return {Window/null} 关联的window对象，反之 null
			 */


			getWindow: function(node) {
				var doc = node.ownerDocument || node;
				return doc.defaultView || doc.parentWindow || null;
			},
			/**
			 * 获取节点关联的 document 节点.
			 * 
			 * @param {DOMNode} node 目标节点
			 *
			 * @return {Document/null} 关联的 document 节点 ，反之 null
			 */
			getDocument: function(node) {
				return node.nodeType == 9 ? node : node.ownerDocument || node.parentNode.ownerDocument || null;
			},


			/**
			 * 获取最近的指定nodeName的元素节点.
			 *
			 *     
			 *         MSeditor.dom.utils.getRecentNode(p,'span'); // return Array
			 *         alert(recentSpan[0].nodeName); // span
			 *
			 * @param  {DOMNode} node  坐标元素
			 * @param  {String} findName   查找的元素名称
			 * 
			 * @return {Array/null}
			 * 返回一个长度为2的数组，数组第0个元素存放的是坐标元素之前的最近节点(如果存在)，第1个元素存放的则是坐标元素之后的最近节点(如果存在)
			 */
			getRecentNode: function(node, findName) {
				findName = node.ownerDocument.getElementsByTagName(findName.toLowerCase());
				if (!findName.length) {
					return null;
				}
				var i = -1,
					leftNode = null,
					rightNode = null;
				while (i++, findName[i]) {
					if (findName[i] == node) {
						continue;
					}
					if (this.getPosition(findName[i], node) % 16 == 4) {
						leftNode = findName[i];
					} else {
						rightNode = findName[i];
						break;
					}
				}
				return [leftNode, rightNode];
			},


			/**
			 * 获取节点A相对于节点B的位置关系.
			 *
			 *     var nodeA=document.documentElement,
			 *         nodeB=document.body;
			 *     if (MSeditor.dom.utils.getPosition(nodeA,nodeB) % 16 == 4) {
			 *         alert('nodeA包含nodeB并且在nodeB之前');
			 *     }
			 *
			 * @param  {HTMLElement} nodeA
			 * @param  {HTMLElement} nodeB
			 * 
			 * @return {Number}
			 * @return return.0  元素相同
			 * @return return.1  两个节点在不同的文档中
			 * @return return.2  节点A在节点B之后
			 * @return return.4  节点A在节点B之前
			 * @return return.10 节点A被节点B包含且节点A在节点B之后
			 * @return return.20 节点A包含节点B且节点A在节点B之前
			 */
			getPosition: function(nodeA, nodeB) {
				if (nodeA == nodeB) {
					return 0;
				}
				if (nodeA.ownerDocument != nodeB.ownerDocument) {
					return 1;
				}
				if (nodeA.compareDocumentPosition) {
					return nodeA.compareDocumentPosition(nodeB);
				} else if (nodeA.contains) {
					var index;
					if (nodeA.sourceIndex < nodeB.sourceIndex) {
						index = 4;
					} else {
						index = 2;
					}
					if (nodeA.contains(nodeB)) {
						index += 16;
					} else if (nodeB.contains(nodeA)) {
						index += 8;
					}
					return index;
				}
				var parentA = [nodeA],
					parentB = [nodeB],
					node = parentB.parentNode;
				while (node) {
					if (node == nodeA) {
						return 20;
					}
					parentB.push(node);
					node = node.parentNode;
				}
				node = parentA.parentNode;
				while (node) {
					if (node == nodeB) {
						return 10;
					}
					parentA.push(node);
					node = node.parentNode;
				}
				parentA.reverse();
				parentB.reverse();
				if (parentA[0] != parentB[0]) {
					return 1;
				}
				var i = -1,
					indexA,
					indexB;
				while (i++, parentA[i] == parentB[i]) {};
				indexA = this.getNodeIndex(parentA[i]);
				indexB = this.getNodeIndex(parentB[i]);
				if (indexA > indexB) {
					return 4;
				}
				return 2;
			},


			/**
			 * 获取元素在父节点中的偏移量.
			 *
			 *     alert(MSeditor.dom.utils.getNodeIndex(document.body));
			 *
			 *     注意：函数将忽略空白文本节点
			 *     
			 * @param  {DOMNode} node 目标元素
			 * @return {Number}   元素在父节点中的偏移量
			 */
			getNodeIndex: function(node) {
				if (!node.parentNode)
					return;
				var child = this.child(node.parentNode),
					i = 0;
				MSeditor.utils.eachArray(child, function(c) {
					if (c == node) {
						return i;
					}
					i++;
				});
			},
			/**
			 * 获取指定文档的 body 元素.
			 *
			 * @param  {Document} doc 可选／body 元素所属的 document 节点，如果为定义讲默认为当前 document 节点
			 * 
			 * @return {HTMLElement/null} body 元素
			 */
			getBody: function(doc) {
				doc = doc || document;
				return doc.getElementsByTagName("body")[0] || doc.body || null;
			},


			/**
			 * 获取指定文档的 head 元素.
			 *
			 * @param  {Document} doc 可选／head 元素所属的 document 节点，如果为定义讲默认为当前 document 节点
			 * 
			 * @return {HTMLElement/null} head 元素
			 */


			getHead: function(doc) {
				doc = doc || document;
				return doc.getElementsByTagName('head')[0] || null;
			},


			/**
			 * 获取 node 节点所属文档的根节点.
			 * 
			 * @param  {DOMNode} node 目标节点
			 * 
			 * @return {MSEDomElement/null}
			 */
			root: function(node) {
				return this.getDocument(node).documentElement || null;
			},


			/**
			 * 为&lt;head&gt;标签中添加一个内部样式表&lt;style&gt;标签或添加一个外部样式表&lt;link&gt;标签
			 * 
			 * @param {String} css 样式表文本或外部样式表文件路径
			 * @param {Document} doc 可选／目标文档，默认当前 document
			 * 
			 *      cssText='body  { font-family: Verdana, sans-serif;}',
			 *      MSeditor.dom.utils.style(cssText);
			 *      MSeditor.dom.utils.style('mySite/myCss.css');
			 *      MSeditor.dom.utils.style('mySite/myCss.css?18382');
			 *
			 * @return {HTMLElement} 
			 */
			style: function(css, doc) {
				var head = this.getHead(doc),
					newStyle;
				if (/\.css\??.*$/.test(css)) {
					newStyle = this.append('<link>', head);


					this.setAttr(newStyle, {
						'type': 'text/css',
						'rel': 'stylesheet',
						'href': css
					});
				} else {
					newStyle = this.append('<style type="text\css">', head);
					if (MSeditor.BROWSER.ie && MSeditor.BROWSER.ie < 9) {
						newStyle.styleSheet.cssText = css;
					} else {
						newStyle.innerHTML = css;
					}
				}
				return newStyle;
			},


			/**
			 * 为&lt;head&gt;标签中添加一个链接外部js文件的&lt;script&gt;标签
			 * 
			 * @param {String} url 一个绝对或相对的外部js文件路径
			 * @param {Function} fn 可选／当外部js文件加载完成后执行的回调函数
			 * @param {Document} doc 可选／目标文档，默认当前 document
			 * 
			 *    MSeditor.dom.utils.script('./myEditor.js',function(){
			 *         if(!myVar){
			 *              setTimeout(arguments.callee);
			 *          }else{
			 *              alert('外部js执行完毕！')
			 *         }
			 *    });
			 *
			 * @return {HTMLElement} 
			 *
			 */
			script: function(url, fn, doc) {
				if (arguments.length == 2) {
					if (MSeditor.utils.isFunction(fn)) {
						fn = fn;
						doc = document;
					} else {
						fn = null;
						doc = doc;
					}
				}



				var newScript = document.createElement('script'),
				    head = this.getHead(doc),
				    me=this;
					this.setAttr(newScript, {
						'type': 'text/javascript',
						'src': url
					});

				if (MSeditor.BROWSER.ie && MSeditor.BROWSER.ie < 9) {
						this.bind(newScript, 'readystatechange', function(ev) {
							if (newScript.readyState == "complete" || newScript.readyState == "loaded") {
								if (newScript.readyState == 'complete') {
									me.append(newScript, head);
									if(fn){
										fn(ev);
									}
									return;
								}
								//先保存一下状态，之后调用 script 节点的 children 方法，如果 script 正确加载，那么它的状态将从 loaded（装入） 变成 complete（完成），
								//反之将从  loaded（装入） 变成 loading（装入中），这样就可以判断是否是正确加载
								var firstState = newScript.readyState;
								newScript.children;
								if (firstState == 'loaded' && newScript.readyState == 'loading') {
									//error
									if(fn){
										fn(ev);
									}
								}

							}
						})
					
					
				} else {
					this.append(newScript, head);
					if (fn) {
						this.once(newScript, 'error', function(ev) {
							fn(ev);
						})
						this.once(newScript, 'load', function(ev) {
							fn(ev);
						});
					}
				}

				return newScript;
			},
		
			/**
			 * 查找具有指定 ID 的元素
			 * 
			 * @param {String} elementid 想获取的元素的 id 属性的值
			 * @param {Document} doc 可选／目标文档，默认当前 document
			 *
			 * @return {HTMLElement\null}
			 */
			$: function(elementid, doc) {
				doc = doc || document;
				return doc.getElementById(elementid);
			},


			/**
			 * document文档对象准备好后立即执行所绑定的函数
			 * @param {Function} fn document 文档对象准备好后要执行的回调函数
			 *
			 * 	MSeditor.dom.utils.domReady(document,function (){
			 * 		alert('文档已准备完毕！');
			 * 	});
			 *
			 *
			 * 	MSeditor.dom.utils.domReady(document,myFunction); 
			 *
			 */
			domReady: (function() {
				var BROWSER = MSeditor.BROWSER,
					addFunction = function(fn,doc) {
						var fnList=MSeditor.utils.getCustomData(doc,'domreadyHandler');
						if(!fnList){
							fnList=MSeditor.utils.setCustomData(doc,'domreadyHandler',[]);
						}
						for (var i in fnList) {
							if (fnList[i] == fn)
								return;
						}
						fnList.push(fn);
					},
					x,
					bindFunction = function(doc,fn) {
						////或版本号小于525的webkit引擎的浏览器
						if (BROWSER.webKit && BROWSER.webKit < 525) {
							doc.attachEvent("onreadystatechange", function() {
									if (doc.readyState === "complete") {
										doc.detachEvent("onreadystatechange", arguments.callee);
										fn();
									}
								})
								//如果是ie6 7 8
						} else if (BROWSER.ie && BROWSER.ie < 9) {
							try {
								doc.documentElement.doScroll("left");
								fn();
							}catch(e) {
								x=setInterval(function() {
									try {
										doc.documentElement.doScroll("left");
										var a=function(){};
										a
										fn();
										console.log('加载了！！！！');
										window.clearInterval(x);
									}catch(e){}
								}, 50);
							}
							return;
						} else if (doc.addEventListener) {
							doc.addEventListener("DOMContentLoaded", function() {
								doc.removeEventListener("DOMContentLoaded", this, false);
								fn();
							}, false);
						} else {
							window.addEvent('load', fn);
						}
					},
					//是否已经绑定domready函数
					bound = false,
					//dom是否已经加载完成
					domReady = false;
				return function(fn, doc) {
					var doc = doc || document;
					//是否绑定事件
					if(!MSeditor.utils.getCustomData(doc,'bindDomreadyHandler')){
						MSeditor.utils.setCustomData(doc,'bindDomreadyHandler',true);
							bindFunction(doc, function(){
								MSeditor.utils.setCustomData(doc,'ready',true);
								var fnList=MSeditor.utils.getCustomData(doc,'domreadyHandler');
								if (fnList.length) {
									var k = 0;
									while (fnList[k]) {
										fnList[k]();
										k++;
									}
								}
							});
					}
					//如果这个document已经完成，直接执行绑定程序
					if (MSeditor.utils.getCustomData(doc,'ready')) {
						fn();
						return;
					}
					//没有就添加到列表中
					addFunction(fn,doc);
				}
			})(),
			/**
			 * 将 HTML 文本转换成节点.
			 * @param {String} HTMLText 转换的 HTML 文本
			 * @param {Document} doc 目标文档
			 * 
			 * @return {DOMNode／Array} 
			 * 如果 HTMLText 是一个 HTML 开始标签，例如 '&#60;div>' 或 '&#60;div class="myDiv">' ， 那么函数返回的将是一个单独的元素
			 * 如果不是开始标签，那么将返回一个数组
			 */
			HTMLToNode: function(HTMLText, doc) {
				doc = doc || document;
				HTMLText = HTMLText.replace(/^\s*|\s*$|\n|\r/g, '');
				var reg = /^<([a-z]+[1-6]?)([^>]*?)>$/g,
					starTag = reg.exec(HTMLText);
				if (starTag) {
					var cElement = doc.createElement(starTag[1]);
					if (starTag[2]) {
						reg = /([^\s]+) *= *(['"]{1}[^>]*?['"]{1}|[^> '"]+?)( |$)/g;
						var attr = reg.exec(starTag[2]);
						while (attr) {
							cElement.setAttribute(attr[1], attr[2].replace(/^['"]|['"]$/g, ''));
							attr = reg.exec(starTag[2]);
						}
					}
					return cElement;
				} else {
					var emptyDiv = doc.createElement('div');
					emptyDiv.innerHTML = HTMLText;
					if (this.isEmpty(emptyDiv)) {} else {
						return MSeditor.utils.makeArray(emptyDiv.childNodes);
					}
					return null;
				}
			}


		} //return end
	}();

	/**
	 * @class MSeditor.mseNode
	 * 代表一个原生 DOM 节点的对象.
	 *
	 * 			var doc=document,
	 * 			someENode=MSeditor.mseNode(doc);
	 * 			alert(someENode.$==doc); // true
	 * 			alert(someENode.type); // "document"
	 * 			someENode.bind('click',function(){alert('Hello World')});
	 * 			
	 * @param {DOMNode/HTMLText} nodeObj
	 * @return {MSeditor.mseNode}  MSeditor.mseNode 对象
	 */
	MSeditor.mseNode = function() {
		var ClassMseNode = function(obj) {


			/**
			 * @property {Array} $
			 * 对象所表示的原生 DOM 节点的列表
			 * @readonly
			 */
			/**
			 * @property {Number} length
			 * 节点列表中的原生 DOM 节点的数量
			 * @readonly
			 */
			if (!obj.length) {
				obj = [obj];
			} else {
				if (!MSeditor.utils.isArray(obj)) {
					//如果不把原生nodeList转换为数组的，以遍历的时候原生nodeList的自我更新很麻烦
					obj = MSeditor.utils.makeArray(obj);
				}

			}
			this.$ = obj;
			this.length = this.$.length;
		};
		ClassMseNode.prototype = {
			/**
			 * 为当前对象添加一个自定义属性.
			 * 
			 *     注意：当复制当前对象时对象的自定义属性将不会被复制
			 *     
			 * @param {String} key  用于识别的属性名称
			 * @param {Object} value 属性值
			 * 
			 */
			setCustomData: function(key, value) {
				MSeditor.utils.setCustomData(this, key, value);
			},
			/**
			 * 获取当前对象的自定义属性.
			 *
			 * @param  {String} key 属性名称
			 * @return {Mixed}  属性名称对应的值
			 */
			getCustomData: function(key) {
				return MSeditor.utils.getCustomData(this, key);
			},


			/**
			 * 删除当前对象指定名称的自定义属性.
			 *
			 * @param  {String} key 属性名称
			 */
			removeCustomData: function(key) {
				MSeditor.utils.removeCustomData(this, key);
			},


			/**
			 * 清除当前对象的所有自定义属性.
			 */
			clearCustomData: function() {
				MSeditor.utils.removeCustomData(this);
			},
			/**
			 * 获取节点列表的最后一个节点.
			 *
			 * @return {MSeditor.mseNode} 新的 MSeditor.mseNode 对象
			 * @chainable          
			 */
			last: function() {
				var node = this.$[this.$['length'] - 1] || this.$;
				return new ClassMseNode(node);
			},
			/**
			 * 获取节点列表的第一个节点.
			 *
			 * @return {MSeditor.mseNode} 新的 MSeditor.mseNode 对象
			 * @chainable
			 */
			first: function() {
				return new ClassMseNode(this.$[0] || this.$);
			},


			_changeLength: function() {
				this.length = this.$.length;
			},
			_domUtils: MSeditor.domUtils,
			/**
			 * 设置节点列表每个元素的内容.
			 * @param {String} content  需要设置的新文本内容
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			text: function(content) {
				if (content) {
					var me = this;
					this.eachList(function(targetNode) {
						me._domUtils.text(targetNode, content);
					});
				}
				return this;
			},
			/**
			 * 为节点列表中所有的元素批量添加或改变其指定属性.
			 * 如果 name 是对象将忽略 value 
			 *
			 *     var oneEnodeObj.setAttr('id','myDiv');
			 *     oneEnodeObj.setAttr({'id':'myDiv','class':'wrapDiv'});
			 *     
			 * @param {Object/String} name  以属性名和值组成的对象或属性名
			 * @param {String} value  属性值
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			setAttr: function(name, value) {
				if (name) {
					var me = this;
					this.eachList(function(targetNode) {
						me._domUtils.setAttr(targetNode, name, value);
					});
				}
				return this;
			},
			/**
			 * 从节点列表中的所有元素中移除单个或多个属性.
			 * 
			 *                  someENode.removeAttr(['class','id']);
			 *					 someENode.removeAttr('style');
			 *                  
			 * @param {Array/String} name  单个属性名或以属性名组成的数组
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			removeAttr: function(name) {
				if (name) {
					var me = this;
					this.eachList(function(targetNode) {
						me._domUtils.removeAttr(targetNode, name);
					});
				}
				return this;
			},
			/**
			 * 为节点列表所有节点绑定一个或多个事件处理函数.
			 * @param  {String} eventName 一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'，如果事件名称是多个时用空格分隔，事件的命名空间用'.'在名称后面连接，值得注意的是带命名空间的事件在触发是运行的效率将高于普通绑定的事件
			 * @param  {Function} handler   事件发生时运行的回调函数，回调函数将自动接收一个MSeditor.Dom.event对象
			 * @param  {Object} scopeObj  可选/回调函数的作用域，如果设定了该参数那么在运行回调函数是回调函数的作用域将指向给定的对象，如果省略作用域将指向当前对象
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			bind: function(eventName, handler, scopeObj) {
				var me = this;
				this.eachList(function(targetNode) {
					me._domUtils.bind(targetNode, eventName, handler, scopeObj);
				});
				return this;
			},


			/**
			 * 为节点列表所有节点绑定一个一次性事件函数
			 * @param  {String} eventName 一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'
			 * @param  {Function} handler   事件发生时运行的回调函数，回调函数将自动接收一个event对象
			 * @param  {Object} scopeObj  可选/回调函数的作用域，如果设定了该参数那么在运行回调函数是回调函数的作用域将指向给定的对象，如果省略作用域将指向当前对象
			 *
			 * 		注意：如果给定的eventName有命名空间，once将忽略该命名空间
			 * 		
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			once: function(eventName, handler, scopeObj) {
				var me = this;
				this.eachList(function(targetNode) {
					me._domUtils.once(targetNode, eventName, handler, scopeObj);
				});
				return this;
			},
			/**
			 * 卸载绑定在节点列表所有节点上的事件函数.
			 *
			 * @param  {String} eventName 可选/一个或多个的事件名称，注意的是事件名称不含'on'，例如'click'、'keydown'，如果事件名称是多个时用空格分隔，事件的命名空间用'.'在名称后面连接
			 * @param  {Function} handler 可选/绑定的事件函数
			 *
			 * 		注意：如果只给定eventName参数，那么unbind将卸载所有类型为eventName的事件函数，
			 * 		反之只给定handler参数的话将卸载所有事件类型下的handler函数
			 * 		而如果不给定任何参数，那么unbind将卸载该对象上绑定的所有事件对象
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			unbind: function(eventName, handler) {
				var me = this;
				this.eachList(function(targetNode) {
					me._domUtils.unbind(targetNode, eventName, handler);
				});
				return this;
			},
			_toNativeNode: function(node) {
				if (node['_eNodeToNode']) {
					node = node.$;
				} else if (typeof node == 'string') {
					node = this._domUtils.HTMLToNode(node, this._domUtils.getDocument(this.$[0]) || document);
				}
				return node;
			},
			// return array
			_appendToMy: function(node, position) {
				node = this._toNativeNode(node);
				var appendNodes = [], //最后返回的数组
					domUtils = this._domUtils;
				if (node) {
					function append(toAppend) {
						if (position == 'after') {
							domUtils.after(node, toAppend);
						} else if (position == 'before') {
							domUtils.before(node, toAppend);
						} else {
							domUtils.append(node, toAppend, position);
						}
					}
					if (this.length > 1) {
						this.eachList(function(ele) {
							if (this.$ != ele) {
								node = domUtils.cloneNode(node);
							}
							append(ele);
							appendNodes = MSeditor.utils.pushToArray(appendNodes, node);
						});
					} else {
						append(this.$[0]);
						appendNodes = MSeditor.utils.pushToArray(appendNodes, node);
					}
				}


				return appendNodes;
			},
			/**
			 * 把节点列表所有节点按顺序插入到 node 的子节点列表的开头或结尾处.
			 * 
			 * @param  {DOMNode/MSeditor.mseNode} node 目标对象
			 * 如果 node 是列表，那么插入的是当前对象节点列表的副本
			 * @param  {Boolean} [toStart=false]
			 * 可选／指定把追加的子节点添加在当前节点的开头还是末尾，默认在结尾
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			appendTo: function(node, toStart) {
				node = node['_toNativeNode'] ? node : new ClassMseNode(node);
				node.append(this.$, toStart);
				return this;
			},
			/**
			 * 把 node 插入到节点列表所有节点的子节点列表的开头或结尾处.
			 * @param  {DOMNode/MSeditor.mseNode} node 插入的对象
			 * @param {Boolean} [toStart=false] 可选/指定把追加的子节点添加在当前节点的开头还是末尾.
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			append: function(node, toStart) {
				this._appendToMy(node, toStart);
				return this;
			},


			/**
			 *
			 * 把当前节点插入至参数 node 中给定的对象之后.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} node 目标对象
			 * 如果 node 是列表，那么插入的是当前对象节点列表的副本
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			afterTo: function(node) {
				node = node['_eNodeToNode'] ? node : new ClassMseNode(node);
				node.after(this.$, toStart);
				return this;
			},
			/**
			 *
			 * 把 node 插入到节点列表所有节点之后.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} node 目标对象
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			after: function(node) {
				this._appendToMy(node, 'after');
				return this;
			},
			/**
			 * 用节点 node 的副本替换节点列表所有节点,替换后节点列表中的列表将会有所改变.
			 * @param  {HTMLElement/TextNode/HTMLText} node  要替换当前元素的元素名
			 * @return {DOMNode/Array}  替换后的元素
			 */
			replace: function(node) {
				node = this._toNativeNode(node);
				if (node.nodeType < 4) {
					this.$ = this._domUtils.replace(this.$, node);
					this._changeLength();
				}
				return this;
			},
			/**
			 *
			 * 把 node 插入到节点列表所有节点之前.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} node 目标对象
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			before: function(node) {
				this._appendToMy(node, 'before');
				return this;
			},
			/**
			 *
			 * 把当前节点插入至参数 node 中给定的对象前.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} node 目标对象
			 * 如果 node 是列表，那么插入的是当前对象节点列表的副本
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			beforeTo: function(node) {
				node = node['_eNodeToNode'] ? node : new ClassMseNode(node);
				node.before(this.$, toStart);
				return this;
			},
			/**
			 * 创建当前对象副本.
			 * @return {MSeditor.mseNode} 一个当前对象的副本
			 */
			clone: function() {
				return ClassMseNode(this._domUtils.cloneNode(this.$));
			},
			_wrapMyNodes: function(element, all) {
				var wrapper = [];
				element = this._toNativeNode(element);
				if (element['length']) {
					element = element[0];
				}
				domUtils = this._domUtils;
				if (all) {
					element = domUtils.before(this.$[0], element.cloneNode());
					domUtils.append(this.$, element);
					wrapper = element;
				} else {
					this.eachList(function(ele) {
						element = domUtils.cloneNode(element);
						domUtils.wrap(ele, element);
						wrapper.push(element);
					});
				}
				return new ClassMseNode(wrapper);
			},
			/**
			 * 用指定的元素包裹当前对象节点列表的每个节点.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} element 目标元素
			 * @return {MSeditor.mseNode}   对象本身
			 *
			 * @chainable
			 */
			wrap: function(element) {
				this._wrapMyNodes(element);
				return this;
			},
			/**
			 * 用指定的元素包裹当前对象节点列表的所有节点.
			 *
			 * @param  {DOMNode/MSeditor.mseNode} element 目标元素
			 * @return {MSeditor.mseNode}   对象本身
			 *
			 * @chainable
			 */
			wrapAll: function(element) {
				this._wrapMyNodes(element, true);
				return this;
			},
			/**
			 * 删除节点列表的所有节点的父元素.
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 *
			 * @chainable
			 */
			unwrap: function() {
				var parents = [],
					parentNode;
				this.eachList(function(node) {
					parentNode = node.parentNode;
					if (parentNode && parentNode.nodeType == 3) {
						parents.push(parentNode);
					}
				});
				if (parents.length) {
					for (var i in parents) {
						this.domUtils.removeNode(parents[i], true);
					}
				}
				return this;
			},
			/**
			 * 遍历当前对象节点列表的所有节点.
			 *
			 * @param  {Function} fn 
			 * 一个筛选函数. 如果给定 fn 函数，将子元素逐个传给 fn，如果 fn 返回 false 将直接返回之前得到的子元素列表
			 * @return {Array} 	根据 fn 得到的节点列表 
			 */
			eachList: function(fn, scope) {

				if (this.length) {
					if (this.length == 1) {
						if (fn(this.$[0]) === false) return [];
					} else if (this.length > 1) {
						var nodes = [];
						MSeditor.utils.eachArray(this.$, function(node) {
							scope = scope || this;
							if (fn(node) === false) return false;
							nodes.push(node);
						});
						return nodes;
					}
				}
				return this.$;
			},
			/**
			 * 设置节点列表每个元素的样式属性.
			 *
			 * @param {String/Object} 	key  		样式属性名或以属性名和值组成的对象
			 * @param {String} 			value  		把参数 key 中指定的属性设置为 value 的值，如果参数key是一个 Object 那么参数 value 将被忽略
			 *
			 * @return {MSeditor.mseNode}   对象本身
			 *
			 * @chainable
			 */
			css: function(key, value) {
				var me = this;
				this.eachList(function(ele) {
					if (ele.nodeType == 1) {
						me._domUtils.css(ele, key, value);
					}
				});
				return this;
			},
			/**
			 * 设置节点列表每个元素的样式属性.
			 * @param  {String} content  css 内联样式文本
			 * @param  {Boolean} [replace=false] 可选／是否追加，默认为替换
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			cssText: function(content, replace) {


				this.eachList(function(ele) {
					if (ele.nodeType == 1) {
						if (replace === true) {
							ele.style.cssText = content;
						} else {
							ele.style.cssText += content;
						}


					}
				});
				return this;
			},
			/**
			 * 删除节点列表每个元素的所有子节点.
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			empty: function() {
				var me = this;
				this.eachList(function(ele) {
					if (ele.nodeType == 1) {
						me._domUtils.empty(ele);
					}
				});
				return this;
			},
			/**
			 * 设置节点列表每个元素的类名.
			 * 
			 * @param {String} className    添加的类名
			 * @param {String} replaceClass 可选／替换的类名，用 replaceClass 替换元素类名中的 className
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 * 
			 */
			addClass: function(className, replaceClass) {
				var me = this;
				this.eachList(function(ele) {
					if (ele.nodeType == 1) {
						me._domUtils.addClass(ele, className, replaceClass);
					}
				});
				return this;
			},
			/**
			 * 设置节点列表每个元素的 HTML 内容.
			 *
			 * @param  {String} htmlText HTML 文本
			 * @param {Boolean} join 可选／设定 htmlText 的添加方式,默认替换目标元素的 HTML 内容
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 */
			html: function(htmlText, join) {
				if (htmlText) {
					var me = this;
					this.eachList(function(ele) {
						if (ele.nodeType == 1) {
							me._domUtils.html(ele, htmlText, join);
						}
					});
				}
				return this;
			},
			/**
			 * 删除节点列表每个节点.
			 * 
			 * @param  {Boolean} [retainChildren=false] 可选/是否保留子节点。如果为 true 将保留子元素，默认为false
			 * 
			 * @return {MSeditor.mseNode}   对象本身
			 * @chainable
			 *
			 */
			remove: function(retainChildren) {

				var me = this;
				this.eachList(function(ele) {
					me._domUtils.remove(ele, retainChildren);
				});
				return this;
			},
			/**
			 * 获取一个包含选定节点的 MSeditor.mseNode 对象.
			 * @param  {Number} start 规定从何处开始选取。如果是负数，那么它规定从节点列表尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推
			 * @param  {Number} end   可选／规定从何处结束选取
			 * @return {MSeditor.mseNode}   包含选定节点的 MSeditor.mseNode 对象
			 */
			item: function(start, end) {
				return new ClassMseNode(this.$.slice(start, end));
			}


		};


		return function(nodeObj, doc) {
			if (nodeObj) {
				var MSEDomObj;
				if (typeof nodeObj == 'string') {
					nodeObj = MSeditor.domUtils.HTMLToNode(nodeObj, doc);
				}
				return MSEDomObj = new ClassMseNode(nodeObj);
			}
		}
	}();

	/**
	 * @class MSeditor.Template
	 * 简单的变量插值模板类.
	 * 
	 * @constructor 
	 * 简单的变量插值模板类，用于用指定的字符串替换模版中的变量，并输出最终字符串.
	 *
	 *
	 * @param {String} source 
	 * 莫版数据.
	 *
	 * 莫版数据中的变量用一对花括号 {} 标示，变量名在花括号中，例如：{id}.
	 * @return {MSeditor.Template instance}
	 */
	/**
	 * @property {String} source
	 * 模版数据.
	 */
	/**
	 * @method output
	 * 输出替换后的数据.
	 *  
	 * @param {Array/Object} data 替换模版变量的数据.	
	 * 
	 * @param data.Array
	 * 按推进的方式把模版中的变量用数组的值按顺序替换.
	 * 
	 *	       var template=new MSeditor.Template('<div class="{divClass}"></div><span class="{spanClass}"></span>');
	 *	       template.output(['mydiv','myspan','someClass']); // '<div class="mydiv"></div><span class="myspan"></span>'
	 *	       
	 * @param data.Object
	 * 用对象中的变量值替换模版中的所有对应的变量.
	 * 
	 *	       var template=new MSeditor.Template('<div id="{divClass}" class="{divClass}"></div><span class="{spanClass}"></span>');
	 *	       template.output({'divClass':'divClass','spanClass':'myspan'}); // '<div id="mydiv" class="mydiv"></div><span class="myspan"></span>'
	 *
	 * @return {String} 替换后的数据	
	 */
	
	MSeditor.Template = function(source) {
		this.source = source;
		this.output = function(data) {
			if (!!this.source) {
				var newSource = this.source;
				if (MSeditor.utils.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						newSource = newSource.replace(/\{.*\}/, data[i]);
					}
					//剩下没替换的直接变空
					newSource = newSource.replace(/\{.*\}/, '');
				} else {

					for (var i in data) {
						newSource = newSource.replace(new RegExp('{' + i + '}', 'g'), data[i]);
					}
				}
				return newSource;
			}

		}
	}
	/**
		 * @class MSeditor.EventBase
		 * 对象自定义事件构造器.
		 * 
		 * 此类不能单独使用
		 *
		 *
		 * @constructor 通过继承此类获得 EventBase 的 on fireListener 等方法.
		 * 
		 * 		var someClass=function(){
		 * 			new MSeditor.EventBase();
		 * 		}
		 * 		var ex=new someClass();
		 * 		ex.on('load',function(ev){
		 * 			alert(ev.type);
		 * 		});
		 * 		ex.fireListener('load'); // "load"
		 *
		 * 		ex.on('load',function(ev,arg1,arg2){
		 * 			alert(arg1); //'age 22'
		 * 			alert(arg2); //'name has'
		 * 		});
		 *
		 * 		ex.fireListener('load','age 22','name has'); 
		 */
		
		/**
		 * @method on
		 * 绑定一个事件.
		 *
		 * 		var ex=new someClass();
		 * 		ex.on('load',function(ev){
		 * 			alert(ev.type);
		 * 		});
		 *
 		 * @param  {String}   eventName 事件名称
		 * @param  {Function} fn    处理函数
		 * @param  {Object}   [scopeObj=this]  可选／处理函数的上下文，如果未设置将指向当前对象
		 */
		/**
		 * @method once
		 * 绑定一个只调用一次的事件.
		 * 
 		 * @param  {String}   eventName 事件名称
		 * @param  {Function} fn    处理函数
		 * @param  {Object}   [scopeObj=this]  可选／处理函数的上下文，如果未设置将指向当前对象
		 */
		/**
		 * @method queryListener
		 * 查询是否绑定给的的事件.
		 * @param  {String} eventName 事件名称
		 * @return {Boolean}  如果存在返回 true
		 */
		/**
		 * @method fireListener
		 * 触发给定的事件.
		 * 
		 * @param  {String} eventName 事件名称
		 * @param  {Mixed} arguments1 后续参数
		 * @param  {Mixed} arguments2 后续参数
		 * @param  {Mixed} argumentsN 后续参数
		 *
		 * eventName 之后的参数将按给定的顺序传递给事件处理函数
		 */
		/**
		 * @method removeListener
		 * 清除指定事件或事件下的一个处理函数.
		 *
		 * 如果给定参数 fn ，将清除单个处理函数，反之清除整个事件
 		 * @param  {String}   eventName 事件名称
		 * @param  {Function} fn    回调函数
		 */
		
		/**
		 * @method removeAllListener
		 * 清除对象的全部事件.
		 */
		
		MSeditor.EventBase = function() {
			/**
			 * @property {Object} _customEventsHander
			 * 存储对象自定义事件的处理函数.
			 *
			 * 形态为：
			 *
			 * {'evnetName':[fn1,fn2],'evnetName':[fn1,fn2]}
			 * @private
			 * @return {Object}
			 */
			/**
			 * @property {Object} _customEventsHanderScope
			 * 存储对象自定义事件的处理函数的上下文.
			 *
			 * 形态为：
			 *
			 * {'evnetName':[scope1,scope2],'evnetName':[scope1,scope2]}
			 * @private
			 * @return {Object}
			 */
			this._customEventsHander = {};
			this._customEventsHanderScope = {};
			this.on = function(eventName, fn, scopeObj) {
				eventName = eventName.replace(/^ *| *$/g, '').toLocaleLowerCase();
				if ((eventName = eventName.split(' ')).length > 1) {
					for (var i = 0; i < eventName.length; i++) {
						this.on(eventName[i]);
					}
					return;
				} else {
					eventName = eventName[0];
				}
				var eventList;
				//第一次绑定
				if (!this.queryListener(eventName)) {
					eventList = this._customEventsHander[eventName] = [];
					this._customEventsHanderScope[eventName] = [];
				} else {
					eventList = this._customEventsHander[eventName];
				};

				if (eventList.length > 1) {
					for (var i = 0; i < eventList.length; i++) {
						if (eventList[i] === fn) {
							return;
						}
					}
				}
				eventList.push(fn);
				this._customEventsHanderScope[eventName].push(scopeObj || this);
			};
			
			this.once = function(eventName, fn, scopeObj) {
				var me = this;
				this.on(eventName, function() {
					fn.call(scopeObj || me);
					me.removeListener(eventName, fn);
				})
			}
		
			this.queryListener = function(eventName) {
				return eventName in this._customEventsHander;
			};
			var me=this;
			this.evnt=function(){
				MSeditor.Event.call(this);
				this.removeListener=function(){
					
				}
			};
			
			this.fireListener = function(eventName,info) {
				eventName = eventName.toLocaleLowerCase();
				var eventList = this._customEventsHander[eventName];
				if (!eventList || !eventList.length) {
					return;
				}
				this.actvEventName=eventName;
				var hl,
					scopeObjList = this._customEventsHanderScope[eventName],
					evntInfo=new this.evnt();
					evntInfo.type=eventName;
					evntInfo.target=this;
					if(info){
						MSeditor.utils.extend(evntInfo,true,info);
					}
					

				for (var i = 0; i < eventList.length; i++) {
					evntInfo.path=i;
					hl = eventList[i];
					hl.apply(scopeObjList[i],arguments.length > 1 ? [evntInfo].concat(Array.prototype.slice.call(arguments, 1)) : [evntInfo]);
					//, arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : ''
					//ie8 中可能是 Array.prototype.slice.call
					if(evntInfo.pause){
						break;
					}
				}
			};
			this.removeListener = function(eventName, fn) {
				if (!arguments.length) return;
				eventName = eventName.toLocaleLowerCase();
				if (!fn) {
					this._customEventsHander[eventName] = [];
					this._customEventsHanderScope[eventName] = [];
					return;
				}
				var eventList = this._customEventsHander[eventName],
					scopeObjList = this._customEventsHanderScope[eventName];
				if (!eventList || !eventList.length) {
					return;
				}
				var hl;
				for (var i = 0; i < eventList.length; i++) {

					if (eventList[i] === fn) {
						eventList.splice(i, 1);
						scopeObjList.splice(i, 1);
						break;
					}

				}
			};
			// this.removeAllListener = function() {
			// 	this._customEventsHander = {};
			// 	this._customEventsHanderScope = {};
			// };

			
		};

		
		
		

		MSeditor.Event=function(){
			this.type=''; // 事件名称
			this.target=''; // 触发事件的对象
			this.stop=function(){};
			this.removeListener=function(){};
		};
	
	//*************************************************************************************
	//编辑器属性，方法，配置项
	//*************************************************************************************
   /**
	* 	@member MSeditor
	* 	@property {MSeditor.EventInfo instance} event
	* 	全局 evnet 对象.
	*
	* 	每当对象的
	*
	* 	@return {MSeditor.EventInfo instance} MSeditor.EventInfo 实例
	*/
		
	/**
	 * @member MSeditor
	 * 获取一个唯一前缀.
	 *
	 * 		alert(MSeditor.getEditorElementsUniqueId()); // 'mse-5';
	 * @return {String}  
	 */
	MSeditor.getEditorElementsUniqueId = (function() {
		var id = 0;
		return function() {
			return 'mse-' + (++id);
		}
	})();
		/**
		 * @method on
		 * @extends EventBase
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @method once
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @method queryListener
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @method removeAllListener
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @method removeListener
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @method fireListener
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 */
		/**
		 * @property _customEventsHanderScope
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 * @private
		 */
		/**
		 * @property _customEventsHander
		 * @member MSeditor
		 * @inheritdoc MSeditor.EventBase
		 * @private
		 */
		(function (){

			MSeditor.EventBase.call(MSeditor);
			var domUtils = MSeditor.domUtils;
			//clientResize
			/**
			 * @member MSeditor
			 * @event clientresize 当浏览器的大小改变时触发.
			 */
			/**
			 * @member MSeditor
			 * @event codeLoad MSeditor 加载完成时触发.
			 */
			/**
			 * @member MSeditor
			 * @event domReady DOM 准备就绪时触发.
			 */
			// 设置全局事件
			MSeditor.on('a',function(ev){
				alert(1)
			})
			MSeditor.on('a',function(ev){
				alert(2) ;
				ev.removeListener(); 
			})
			MSeditor.on('a',function(ev){
				alert(3)
			})
			MSeditor.fireListener('a');
MSeditor.fireListener('a');
			(function clientResize() {
				var win = domUtils.getWindow(document),
					html = domUtils.root(document),
					startScan = false,
					scopeScan,
					beforeWidth = html.clientWidth,
					beforeHeight = html.clientHeight,
					nowWidth, nowHeight;
				domUtils.bind(window, 'resize', function() {
					if (!startScan) {
						startScan = true;
						scopeScan = setInterval(function() {
							nowWidth = html.clientWidth;
							nowHeight = html.clientHeight;
							if (nowWidth != beforeWidth || nowHeight != beforeHeight) {
								beforeWidth = nowWidth;
								beforeHeight = nowHeight;
								MSeditor.fireListener('clientresize', {
									'clientWidth': nowWidth,
									'clientHeight': nowHeight
								});
							}
						}, 200)
					}
				});
				domUtils.bind(document, 'mousedown keydown mouseover blur focus', function(ev) {
					if (ev) {

					} else if (!!startScan) {
						startScan = false
						window.clearInterval(scopeScan);
					}

				});
				domUtils.bind(win, 'blur', function() {
					if (!!startScan) {
						startScan = false
						window.clearInterval(scopeScan);
					}
				});
			})();
			//codeLoad
			(function codeLoad() {
				var scriptElements = document.scripts,
					scriptElements = scriptElements[scriptElements.length - 1];
				domUtils.once(scriptElements, 'load', function() {
					MSeditor.fireListener('codeLoad')
				});
			})();
			//domReady
			(function domReady() {
				domUtils.domReady(function() {
					MSeditor.fireListener('domready');
				})
			})();	
		})();
		
	

	/**
	 * @member MSeditor
	 * @cfg {Object} config
	 * 编辑器默认配置项.
	 *
	 *  
	 * @cfg {String} [config.skin='default']
	 * 默认皮肤
	 *
	 * @cfg {String/Number} [config.width='auto']
	 * 默认宽度
	 *
	 * @cfg {String/Number} [config.height='auto']
	 * 默认高度
	 * 
	 * @cfg {String} [config.reSizer='lr']
	 * 拖拽改变编辑器大小.
	 * 
	 * * lr:水平 
	 * * tb:垂直
	 * * both:双向
	 * * false:不可改变
	 *
	 * @cfg {Number} [config.maxHeight=1200]
	 * 最大高度.
	 *
	 * @cfg {Number} [config.maxWidth=1500]
	 * 最大宽度.
	 *
	 * @cfg {String} [config.ui_color='']
	 * 外观颜色，一个十六进制 (hex) 表示的颜色，例如 #FF0000.
	 *
	 * @cfg {Number} [config.font_size=16]
	 * 编辑器区字体大小.
	 *
	 * @cfg {String} [config.dialog_cover_color='#000000']
	 * 遮罩层颜色.
	 *
	 * @cfg {Number} [config.dialog_cover_opacity=7]
	 * 遮罩层透明度.
	 *
	 * @cfg {Number} [config.dialog_index=10001]
	 * 对话框层级.
	 *
	 * @cfg {Number} [config.ui_border_radius='']
	 * UI元素角半径.
	 *
	 * @cfg {String} [config.font_family='']
	 * 编辑器区字体.
	 *
	 * @cfg {String} [config.iframe_css_url='./style/Meditor_iframe.css']
	 * 编辑器区样式表文件路径.
	 *
	 * @cfg {Number} [config.word_limits='']
	 * 字数限制.
	 *
	 * @cfg {String} [config.default_content='']
	 * 默认内容.
	 *
	 * @cfg {Number} [config.toolbar_spacing=10]
	 * 工具栏间距.
	 *
	 * @cfg {String} [config.toolbar_buttons_default_style='simple']
	 * 工具栏按钮样式.
	 * 
	 * * simple 精简型
	 * * norm 标准型
	 */
	MSeditor.config = {
		skin: 'default',
		width: 'auto',
		height: 'auto',
		reSizer: 'lr',
		maxHeight: '1200',
		maxWidth: '1500',
		ui_color: '',
		font_size: 16,
		dialog_cover_color: '#000000',
		dialog_cover_opacity: 7,
		dialog_index: 10001,
		plugins: '',
		ui_border_radius: '',
		font_family: 'Menksoft2007',
		iframe_css_url: MSeditor.PATH.style + 'Meditor_iframe.css',
		word_limits: '',
		default_content:'',
		toolbar_spacing:'10',
		toolbar_buttons_default_style: 'simple', // default|simple
		toolbar_buttons_mstitle: true,
		toolbar: 'default',
		toolbar_mode: {
			'default': ['Newpage', 'Choose', 'Examine', 'Print', '-', 'Undo', 'Redo', '-', 'Bold', 'Italic', 'Underline', 'Delete', 'Superscript', 'Subscript', '-', 'Removeformat', '-', 'plusTextSize', 'minusTextSize', '/', 'JustifyTop', 'JustifyCenter', 'JustifyBottom', 'JustifyFull', 'Lineheight', '-', 'BulletList', 'NumList', '-', 'Indent', 'Outdent', '-', 'TextColor', 'TextBackground', 'HorizontalText', 'Search', '-', 'Table', 'Sign', 'Link', 'Unlink', 'Anchor', '/', 'Line', 'Smiley', 'Day', 'Time', '-', 'Image', 'Audio', 'Flash', 'Attachment', 'PageBreak', '-', 'MaxiMize', 'Code', 'About']
		},
		tool_label: {
			'Newpage': "  ",
			'Copy': "",
			'Paste': "",
			'Cut': " ",
			'Choose': "   ",
			'Undo': " ",
			'Redo': "  ",
			'Bold': "  ",
			'Print': '',
			'Removeformat': '  ',
			'Italic': "  ",
			'Underline': "  ",
			'Delete': "  ",
			'JustifyTop': "   ",
			'JustifyCenter': "  ",
			'JustifyBottom': "   ",
			'JustifyFull': "    ",
			'Indent': "   ",
			'Outdent': "   ",
			'plusTextSize': "  ",
			'minusTextSize': "  ",
			'Superscript': "   ",
			'Subscript': "   ",
			'Text_letter': "   ",
			'NumList': " ",
			'BulletList': "  ",
			'HorizontalText': "  ",
			'Line': "  ",
			'Search': "   ",
			'TextBackground': "  ",
			'TextColor': "   ",
			'Table': " ",
			'Sign': "  ",
			'Link': " ",
			'Unlink': "   ",
			'Anchor': "   ",
			'Time': "",
			'Image': " ",
			'Flash': "Flash ",
			'Attachment': " ",
			'Smiley': "  ",
			'UserInfo': "   ",
			'PageBreak': "  ",
			'Examine': "  ",
			'MaxiMize': "  ",
			'Code': "HTML ",
			'About': "MSeditor  ",
			'Day': "  ",
			'Lineheight': "   ",
			'Audio': ""
		}
	};

	/**
	 * @member MSeditor
	 * 注册一个编辑器.
	 * @param  {HTMLElement} textArea 替换的 textarea 元素
	 * @param  {Object} [config={}] 可选／编辑器实例配置项
	 * @return {MSeditor.Editor instance}  编辑器实例
	 */
	MSeditor.register = (function() {
		var textAreaList = [];
		//如果已注册返回 true
		function exEepeat(textArea) {
			if (textAreaList.length) {
				for (var i in textAreaList) {
					if (textAreaList[i] == textArea) {
						return true;
					}
				}
			}
			return false;
		};
		//自动注册
		MSeditor.domUtils.domReady(function() {
			var textAreaS = document.getElementsByTagName('textArea');
			if (textAreaS.length) {
				var domUtils = MSeditor.domUtils;
				MSeditor.utils.eachArray(textAreaS, function(ele) {
					if (domUtils.hasClass('MSeditor')) {
						MSeditor.register(ele);
					}

				})
			}
		});
		return function(textArea, config) {
			

			if (typeof textArea == 'string') {
				var textAreaId = textArea,
					textArea = document.getElementById(textArea);
				if (!textArea) {
					throw new Error('未找到元素 ' + textAreaId);
					return null;
				}
			}

			if (!exEepeat(textArea)) {
				textAreaList.push(textArea);
			}
			var newEditor = new MSeditor.editor(textArea, config);
			this.installer(newEditor);
			return newEditor;
		}

	})();
	/**
	 * @member MSeditor
	 * 安装给定的编辑器实例.
	 * @param {MSeditor.Editor instance} editor 编辑器实例
	 */
	MSeditor.installer = function() {
		var condition = false,
			editors = [];
		MSeditor.once('domready',function() {
			
			if (!MSeditor['editorConfig']) {
				MSeditor.domUtils.script(MSeditor.PATH.root + 'config.js', function(){
					//MSeditor.plugins.importPlugins('myPlugin,myPlugin3',function(){alert('ok')})
					MSeditor.editorConfig(MSeditor.config);
					for (var i = 0; i < editors.length; i++) {
						editors[i]._install();
					}
					//setTimeout(arguments.callee,1);
					condition = true;
				});
			}
		})
		return function(editor) {
			if (condition) {
				editor._install();
				return;
			}
			editors.push(editor);
		}
	}();




	
	




	//*************************************************************************************
	//编辑器 UI 层
	//*************************************************************************************
	
	/**
	 * @class MSeditor.UI
	 * @return {[type]} [description]
	 */
	(function() {
		var domUtils = MSeditor.domUtils,
			mseNode = MSeditor.mseNode,
			path = MSeditor.PATH,
			ui = MSeditor.UI,
			browser = MSeditor.BROWSER,
			utils = MSeditor.utils;

		MSeditor.UI = function(editor) {
			this.editor = editor;
			this.buttons = {};
			this.caidang;
			this.duihuakuang;
			this.liebiao;
			MSeditor.EventBase.call(this);
		};
		MSeditor.UI.prototype = {
			renderEditor: function(targetArea) {
				var pop = new MSeditor.UI.Dialog({
					'title': '  '
				});
				pop.visibility(1);

				MSeditor.UI.addButton('x', {
					lable: '123',
					showLable: 1
				})
				var elementID = this.domId = MSeditor.getEditorElementsUniqueId(),
					editorTemplate = new MSeditor.Template('<div class="mse-content" id="{contentID}"><div class="mse-statusbar" id="{statusbarID}"></div></div><div class="mse-tools" id="{toolsID}"></div>');
				this._setStyle();

				targetArea = MSeditor.mseNode(targetArea).setAttr({
					id: elementID,
					'class': 'ms-editor ms-editor-reset'
				});
				targetArea.append(editorTemplate.output({
					'contentID': elementID + '-content',
					'statusbarID': elementID + '-statusbar',
					'toolsID': elementID + '-tools'
				}));

				this._arrangeButton();
				this.editor._stupe(this._getDOM('content'));
			},
			_getDOM: function(id) {
				return domUtils.$(this.domId + '-' + id);
			},
			_setStyle: function() {
				domUtils.style(path.style + 'editor.css');
				//domUtils.style(path.skin+this.editor.config.skin+'/editor.css');
			},
			_arrangeButton: function() {
				this.getButton('x')
			},
			//获取一个按钮的实例
			getButton: function(buttonName) {
				return new MSeditor.UI.Button(buttonName, this.editor)

			}

		};


		//注册一个按钮,为用户留一个接口，简化添加按钮的步骤
		MSeditor.UI.addButton = function(name, config) {

			//demand需求 对话框或下拉菜单
			//showLable 显示文本／默认不显示
			//label 文本或图标
			//icon
			//style
			//默认状态
			if (name in this._buttonsConfig) {
				throw new Error('工具 ' + name + ' 已存在');
				return;
			}
			this._buttonsConfig[name] = config;
		};
		MSeditor.UI._buttonsConfig = {};

		//ui button 基础类
		MSeditor.UI.Button = function(buttonName, editor) {
			if (!MSeditor.UI._buttonsConfig[buttonName]) {
				throw new Error('工具 "' + buttonName + '" 未注册或缺少配置项');
				return;
			}

			var config = {
				demand: '',
				icon: '',
				style: MSeditor.config.toolbar_buttons_default_style, // simple|default 
				lable: '',
				css: 'font-family:has',
				msTitle: buttonName,
				statu: '1',
				command: ''
			};
			utils.extend(config, true, MSeditor.UI._buttonsConfig[buttonName]);
			this.elementId = MSeditor.getEditorElementsUniqueId() + '-button-';
			var buttonHTML = '<a class="{buttonClass}" {msTitle} href="javascript:void(0)" tabindex="-1" {event} >' +
				'<span id={id}icon class="mse-button-icon"></span>' +
				'<span id={id}lable class="mse-button-lable" >{lable}</span></a>';
			buttonHTML = new MSeditor.Template(buttonHTML).output({
				'event': '',
				'buttonClass': 'mse-button mse-button-' + buttonName + ' mse-button-style-' + config.style,
				'id': this.elementId,
				'lable': config.lable,
				'msTitle': config.msTitle && editor.config.toolbar_buttons_mstitle ? utils.msTitleAttr(config.msTitle) : ''
			});
			this.button = mseNode(buttonHTML);
			this.button.appendTo(document.createDocumentFragment());
			if (config.css) {
				this.button.cssText(config.css);
			}

			this.button.appendTo(document.body)
			if (config.statu != 1) {
				this.setStatu(config.statu);
			}
		}

		MSeditor.UI.Button.prototype = {
			_getDom: function(id) {
				var doc = this.button.$[0].parentNode;
				if (doc.nodeType != 11) {
					doc = document;
				}
				var node = domUtils.$(this.elementId + id, doc);
				if (node) {
					return mseNode(node);
				}

			},
			//0 不可用 1默认 2高亮
			setStatu: function(status) {
				this.button.addClass('mse-button-on,mse-button-off', '');
				if (status === 1) {

				} else if (status == 2) {
					this.button.addClass('mse-button-on');
				} else if (status === 0) {
					this.button.addClass('mse-button-off');
				}
			},
			setLable: function(content) {
				this._getDom('lable').html(content);
			},
			setIcon: function(path, css) {
				this._getDom('icon').css('backgroundImage', path);
				if (css) {
					this._getDom('icon').cssText(css);
				}
			}


		};
		MSeditor.UI.element = function() {

		}

		MSeditor.UI.Dialog = function(config) {
			this.dialogList;
			this.box;

			this.config = {
				doc: document,
				drag: true,
				resize: true,
				cover: true,
				title: '',
				closeButton: true,
				elements: ''
			}
			if (config) {
				MSeditor.utils.extend(this.config, true, config);
			}
			config = this.config;

			var me = MSeditor.UI.Dialog,
				dialogListID;
			dialogListID = MSeditor.utils.getCustomData(config.doc, 'mseDialogEnvironmentID');
			if (!dialogListID) {
				dialogListID = MSeditor.utils.setCustomData(config.doc, 'mseDialogEnvironmentID', MSeditor.utils.MSMark());
				me.dialogList[dialogListID] = [];
			}
			this.dialogList = me.dialogList[dialogListID];
			this.dialogList.push(this);
			this.box = this._create();

			if (config.cover) {
				this.cover = this._getCover();
			}
		};
		MSeditor.UI.Dialog.dialogList = {};
		MSeditor.UI.Dialog.prototype = {
			_create: function() {

				var wrap = domUtils.$("mse-dialog-wrap");
				if (!wrap) {
					wrap = mseNode('<div id="mse-dialog-wrap" class="mse-dialog-wrap mse-reset mse-reset-all">');
					wrap.appendTo(domUtils.getBody(this.config.doc));
				}

				var box = mseNode('<div class="mse-dialog">').css({
						'zIndex': MSeditor.config.dialog_index,
						'fontFamily': MSeditor.config.font_family
					}),
					html = '<div class="mse-dialog-header" id="{headerId}" {userSelect} oncontextmenu="return false">{ie8shadow}<span>{title}</span></div>' +
					'<div class="mse-dialog-body" id="{bodyId}"></div>',
					headerId = MSeditor.getEditorElementsUniqueId() + '-dialog-header',
					bodyID = MSeditor.getEditorElementsUniqueId() + '-dialog-body';

				html = new MSeditor.Template(html);
				box.html(html.output({
					'title': this.config.title.replace(/^ *| *$/g, ''),
					'ie8shadow': browser.ie == 8 ? '<hr class="mse-dialog-header-ie8shadow"/>' : '',
					'headerId': headerId,
					'bodyId': bodyID,
					'userSelect': browser.ie ? browser.ie < 10 ? 'onselectstart="return false";' : 'style="-ms-user-select:none; "' : 'style="-webkit-user-select: none;"',

				}));
				box.appendTo(wrap);
				this._setup(domUtils.$(bodyID));
				return box;
			},
			_setup: function(wrap) {
				var wrap = mseNode(wrap);
				wrap.html('<iframe class="mseui-iframe" src="style/icons/cancel.png" scrolling="no" frameborder=0></iframe>')
			},
			//设置可见
			visibility: function(status) {
				if (!!status) {
					for (var i = 0; i < this.dialogList.length; i++) {
						if (this.dialogList[i] != this) {
							this.dialogList[i].visibility(0);
						}
					}
				}
				status = !!status ? 'visible' : 'hidden';
				this['cover'] && this.cover.css('visibility', status);
				this.box.css('visibility', status);
			},

			stopResize: '',
			stopDrag: '',
			setCoordsX: function(x) {
				if (x = Math.max(x, 0)) {
					this.box.css('left', x + 'px');
				}

			},
			setCoordsY: function(y) {
				if (y = Math.max(y, 0)) {
					this.box.css('top', y + 'px');
				}
			},
			_getCover: function() {
				var doc = this.config.doc,
					win = domUtils.getWindow(doc),
					html = domUtils.root(doc),
					cover = domUtils.$("mse-dialog-background-cover");
				if (!cover) {
					cover = domUtils.append('<div id="mse-dialog-background-cover" class="mse-dialog-background-cover">', domUtils.getBody(doc));
					cover = mseNode(cover);
					cover.css({
						'background': MSeditor.config.dialog_cover_color,
						'zIndex': MSeditor.config.dialog_index - 1,
						'position': 'fixed',
						'top': '0px',
						'left': '0px'
					});
					MSeditor.on('resize', function(evInfo) {
						cover.css({
							'width': evInfo.clientWidth + 'px',
							'height': evInfo.clientHeight + 'px'
						})
					});
				}

				return cover;
			}
		}

		//帮助，关于我们，简单设置以插件方式添加，按钮添加在 editor.ui.getDOM(bottom)
	}());

	// =========================================================== 
	// 编辑器插件管理
	// =========================================================== 

	MSeditor.plugins = {

		loaded: (function() {
			//加载完成的插件
			var _completed = {};
			return function(pluginsName, fn) {
				pluginsName = /,/.test(pluginsName) ? pluginsName.split(',') : pluginsName;
				//如果是多个插件名
				var pluginNum = 0;
				if (typeof pluginsName == 'string') {
					if (!(pluginsName in this._completed)) {
						this._completed[pluginsName] = 1;
						MSeditor.domUtils.script(MSeditor.PATH.plugins + pluginsName + '/plugin.js', fn);
					} else {
						throw new Error('插件 "' + pluginsName + '" 已加载');
					}
					return;
				} else {
					for (var i = 0; i < pluginsName.length; i++) {
						arguments.callee.call(this, pluginsName[i], function() {
							pluginNum += 1;
						});
					}

					setTimeout(function() {
						if (pluginNum == pluginsName['length']) {
							fn();
						} else {
							setTimeout(arguments.callee, 50);
						}
					}, 50);
					return;
				};
			}
		})(),
		queryPlugin: function(pluginsName) {
			return pluginsName in _puluginList;
		},
		_puluginList: {},
		//防止插件污染
		add: (function() {
			return function(pluginsName, initMsg) {
				pluginsName = pluginsName.toLocaleLowerCase();
				if (pluginsName in this._puluginList) {
					throw new Error('插件 "' + pluginsName + '" 已注册');
					return;
				}
				this._puluginList[pluginsName] = 1;
				initMsg.call(function() {
					this.path = MSeditor.PATH.plugins + pluginsName;
				});
			}
		})()


	};
	// =========================================================== 
	// 编辑器
	// =========================================================== 

	MSeditor.editor = function(textArea, config) {
		this.config = function() {
			MSeditor.utils.extend(this, true, config);
		}
		this.config.prototype = MSeditor.config;
		this.config = new this.config();
		this.textArea = textArea;
		new MSeditor.EventBase(this);

		this.UI = new MSeditor.UI(this);

	};
	MSeditor.editor.prototype = {
			//设置
			_stupe: function(wrapElement) {
				var domUtils = MSeditor.domUtils,
					doc;
				this.iframe = domUtils.append('<iframe class="mse-iframe ms-editor-reset" style="width: 100%; height: 100%;" frameborder=0>', wrapElement)
				doc = this.iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
				doc.open();
				doc.write('<!DOCTYPE html>' +
					'<html xmlns="http://www.w3.org/1999/xhtml">' +
					'<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>' +
					//'<link rel="stylesheet" type="text/css" href=' + this.config.iframeCssUrl+'>'+
					'</head><body oncontextmenu="return false" contentEditable="true"></body></html>'
				);
				doc.close();
			},
			//渲染编辑器
			_install: function() {
				var domUtils = MSeditor.domUtils,
					editorWrap = domUtils.after('<div>', this.textArea);
				domUtils.cssText(this.textArea, 'visibility: hidden; display: none;');
				this.setSize(editorWrap);
				this.UI.renderEditor(editorWrap);

			},
			setSize: function(wrap) {
				var config = this.config;
				if (config.width) {
					wrap.style.width = config.width.replace(/[^\d]/g, '') + 'px';
				}
				if (config.height) {
					wrap.style.height = config.height.replace(/[^\d]/g, '') + 'px';
				}
			}
		}
		//默认插件写入区域
		// (function(){
		// 	MSeditor.plugins.add('new',function(){
		// 		MSeditor.UI.addButton('new')
		// 	});
		// })();

}());