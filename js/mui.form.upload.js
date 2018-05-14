/*!
 * ======================================================
 * mui.form.upload Template For IM 
 * =======================================================
 * @version:1.0.0
 * @author:yangyuan
 */
(function(w){
	w.uploadForm ={
		index:1,
		size:null,
		imageIndexIdNum:1,
		/**
		 * 是否多选图片  
		 * true多选图片,false单选图片,默认为单选
		 */
		isMultiple:false,
		form:{
			imageList:null,
			files:[]
		},
		initFormImgList:function (opt) {
			uploadForm.isMultiple = opt.hasOwnProperty("isMultiple") ? opt.isMultiple:false;
			uploadForm.form.imageList = document.getElementById(opt.imageList);
			uploadForm.newPlaceholder();
		},
		/**
		 * 初始化图片域占位
		 */
		newPlaceholder:function(){
			//是否支持MUI如果支持监听事件则使用MUI的tap否则使用click
			var isSupportMUI = (typeof mui === 'function');
			var evt = {
				type: isSupportMUI?'tap':'click'
			}
			var placeholder = document.createElement('div');
			placeholder.setAttribute('class', 'image-item space');
			var up = document.createElement("div");
			up.setAttribute('class', 'image-up')
			//删除图片
			var closeButton = document.createElement('div');
			closeButton.setAttribute('class', 'image-close');
			closeButton.innerHTML = 'X';
			closeButton.id = "img-" + uploadForm.index;
			//小X的点击事件
			closeButton.addEventListener(evt.type, function(event) {
				setTimeout(function() {
					for(var temp = 0; temp < uploadForm.form.files.length; temp++) {
						if(uploadForm.form.files[temp].id == closeButton.id) {
							uploadForm.form.files.splice(temp, 1);
						}
					}
					uploadForm.form.imageList.removeChild(placeholder);
				},0);
				return false;
			}, false);
			//添加图片div
			var fileInput = document.createElement('div');
			fileInput.setAttribute('class', 'file');
			console.log("初始化图片ID为"+uploadForm.imageIndexIdNum);
			fileInput.setAttribute('id', 'image-' + uploadForm.imageIndexIdNum);
			fileInput.addEventListener(evt.type, function(event) {
				console.log("index等于"+uploadForm.index);
				uploadForm.chooseImage();
			}, false);
			placeholder.appendChild(closeButton);
			placeholder.appendChild(up);
			placeholder.appendChild(fileInput);
			uploadForm.form.imageList.appendChild(placeholder);
		},
		//获取所有文件
		getFileInputArray:function() {
			return [].slice.call(uploadForm.form.imageList.querySelectorAll('.file'));
		},
		//添加文件
		addFile:function(path) {
			uploadForm.form.files.push({name: "images" + uploadForm.index,path: path,id: "img-" + uploadForm.index});
		},
		//选择图片后显示图片
		chooseImage:function(){
			//是否支持MUI如果支持监听事件则使用MUI的tap否则使用click
			var isSupportMUI = (typeof mui === 'function');
			var evt = {
				type: isSupportMUI?'tap':'click'
			}
			//调用选择图片
			plus.gallery.pick(function(e) {
				//选择图片成功回调
				var up = document.createElement("div");
				up.setAttribute('class', 'image-up');
				for(var i in e.files) {
					console.log("forBegin");
					uploadForm.imageIndexIdNum++;
					uploadForm.index++;
					//构建需显示的所选图片
					var placeholder = document.createElement('div');
					placeholder.setAttribute('class', 'image-item space');
					
					
					//删除图片
					var closeButton = document.createElement('div');
					closeButton.setAttribute('class', 'image-close');
					closeButton.innerHTML = 'X';
					closeButton.id = "img-" + uploadForm.index;
					//小X的点击事件
					closeButton.addEventListener(evt.type, function(event) {
						console.log(this.id);
						setTimeout(function() {
							for(var temp = 0; temp < uploadForm.form.files.length; temp++) {
								if(uploadForm.form.files[temp].id ==  this.id) {  //closeButton.id
									uploadForm.form.files.splice(temp, 1);
								}
							}
							uploadForm.form.imageList.removeChild(event.srcElement.parentNode);  // placeholder
						}, 0);
						return false;
					}, false);
					//添加图片div
					var fileInput = document.createElement('div');
					fileInput.setAttribute('class', 'file');
					console.log("初始化图片ID为"+uploadForm.imageIndexIdNum);
					fileInput.setAttribute('id', 'image-' + uploadForm.imageIndexIdNum);
					//为展示图片添加点击事件
					fileInput.addEventListener(evt.type, function(event) {
						uploadForm.chooseImage();				
					}, false);
					var name = e.files[i].substr(e.files[i].lastIndexOf('/') + 1);
					console.log("name:" + name);
					//对选择的图片进行压缩
					plus.zip.compressImage({
						src: e.files[i],
						dst: '_doc/' + name,
						overwrite: true,
						quality: 50
					}, function(zip) {
						uploadForm.size += zip.size
						console.log("filesize:" + zip.size + ",totalsize:" + uploadForm.size);
						if(uploadForm.size > (10 * 1024 * 1024)) {
							return mui.toast('文件超大,请重新选择~');
						}
						if(false) { //已有图片  !this.parentNode.classList.contains('space')
							console.log(name + "已存在,index为" + uploadForm.index);
							uploadForm.form.files.splice(uploadForm.index - 1, 1, {
								name: "images" + uploadForm.index,
								path: e.files[i]
							});
						} else { //加号
							console.log(name + "不存在,index为" + uploadForm.index);
							uploadForm.addFile(zip.target);
						}
						
					}, function(zipe) {
						console.log(zipe.message);
						mui.toast('压缩失败！')
					});
					placeholder.classList.remove('space');
					up.classList.remove('image-up');
					placeholder.style.backgroundImage = 'url(' + e.files[i] + ')';
					console.log(placeholder.style.backgroundImage);
					//将所构建的所选图片追加至显示图片Div
					placeholder.appendChild(closeButton);
					placeholder.appendChild(up);
					placeholder.appendChild(fileInput);
					uploadForm.form.imageList.appendChild(placeholder);
					console.log(uploadForm.form.imageList.innerHTML);
				}
			}, function(e) {
				//选择图片异常回调方法
				mui.toast(e.message);
			}, {filter:"image",multiple:uploadForm.isMultiple}); //,multiple:true多选属性
			
		},
		//创建上传任务
		createUpload:function(url,option){
			var mask = mui.createMask();
			mask.show();
			try{
			var uploader = plus.uploader.createUpload(getRequestUrl()+url, {
				method: 'POST'
			}, function(upload, status) {
				console.log("upload cb:"+upload.responseText);
				if(status==200){
					var data = JSON.parse(upload.responseText);
					//上传成功，重置表单
					if (data) {
						mask.close();
						mui.toast('保存成功！');
						mui.back();
						console.log("upload success");
					}else{
						mask.close();
						mui.toast('保存失败！,'+upload.responseText);
						console.log("upload fail");
						mui.back();
					}
				}else{
					mask.close();
					mui.toast('保存失败！');
					console.log("upload fail");
					mui.back();
				}
			});
			//添加上传数据
			mui.each(option, function(index, element) {
				if (index !== 'images') {
					console.log("addData:"+index+","+element);
					uploader.addData(index, element);
				} 
			});
			//添加上传文件
			mui.each(uploadForm.form.files, function(index, element) {
				var f = uploadForm.form.files[index];
				console.log("addFile:"+JSON.stringify(f));
				uploader.addFile(f.path, {key: f.name});
			});
			
			uploader.setRequestHeader("TOKEN",getRequestToken());
			uploader.setRequestHeader("LOCAL_USER_INFO",getlocalUserinfoHead());
			
			//开始上传任务
			uploader.start();
			}catch(e){
				console.log(e.message);
			}
		}
	
	} 
	
	
})(window);
