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
		imageIndexIdNum:0,
		form:{
			imageList:null,
			files:[]
		},
		initFormImgList:function (opt) {
			uploadForm.form.imageList = document.getElementById(opt.imageList);
			uploadForm.newPlaceholder(uploadForm.form,uploadForm.index,uploadForm.imageIndexIdNum,uploadForm.size);
		},
		/**
		 * 初始化图片域占位
		 */
		newPlaceholder:function(form,index,imageIndexIdNum,size){
			var fileInputArray = uploadForm.getFileInputArray(form);
			if(fileInputArray &&
				fileInputArray.length > 0 &&
				fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
				return;
			};
			
			//是否支持MUI如果支持监听事件则使用MUI的tap否则使用click
			var isSupportMUI = (typeof mui === 'function');
			var evt = {
				type: isSupportMUI?'tap':'click'
			}
			
			imageIndexIdNum++;
			var placeholder = document.createElement('div');
			placeholder.setAttribute('class', 'image-item space');
			var up = document.createElement("div");
			up.setAttribute('class', 'image-up')
			//删除图片
			var closeButton = document.createElement('div');
			closeButton.setAttribute('class', 'image-close');
			closeButton.innerHTML = 'X';
			closeButton.id = "img-" + index;
	
			//小X的点击事件
			closeButton.addEventListener(evt.type, function(event) {
				setTimeout(function() {
					for(var temp = 0; temp < form.files.length; temp++) {
						if(form.files[temp].id == closeButton.id) {
							form.files.splice(temp, 1);
						}
					}
					form.imageList.removeChild(placeholder);
				}, 0);
				return false;
			}, false);
	
			//添加图片div
			var fileInput = document.createElement('div');
			fileInput.setAttribute('class', 'file');
			fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
			fileInput.addEventListener(evt.type, function(event) {
				var self = this;
				var index = (this.id).substr(-1);
				plus.gallery.pick(function(e) {
					console.log(JSON.stringify(e));
					var name = e.substr(e.lastIndexOf('/') + 1);
					console.log("name:" + name);
	
					plus.zip.compressImage({
						src: e,
						dst: '_doc/' + name,
						overwrite: true,
						quality: 50
					}, function(zip) {
						size += zip.size
						console.log("filesize:" + zip.size + ",totalsize:" + size);
						if(size > (10 * 1024 * 1024)) {
							return mui.toast('文件超大,请重新选择~');
						}
						if(!self.parentNode.classList.contains('space')) { //已有图片
							form.files.splice(index - 1, 1, {
								name: "images" + index,
								path: e
							});
						} else { //加号
							placeholder.classList.remove('space');
							uploadForm.addFile(zip.target,form,index);
							uploadForm.newPlaceholder(form,index,imageIndexIdNum,size);
						}
						up.classList.remove('image-up');
						placeholder.style.backgroundImage = 'url('+zip.target+')';
					}, function(zipe) {
						mui.toast('压缩失败！')
					});
				}, function(e) {
					mui.toast(e.message);
				}, {filter:"image",multiple:true}); //,multiple:true多选属性
			}, false);
			placeholder.appendChild(closeButton);
			placeholder.appendChild(up);
			placeholder.appendChild(fileInput);
			form.imageList.appendChild(placeholder);
		},
		//获取所有文件
		getFileInputArray:function(form) {
			return [].slice.call(form.imageList.querySelectorAll('.file'));
		},
		//添加文件
		addFile:function(path,form,index) {
			form.files.push({name: "images" + index,path: path,id: "img-" + index});
			index++;
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
