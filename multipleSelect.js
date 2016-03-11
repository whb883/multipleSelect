/*!
	 * multipleSelect, a javascript interactive select library.
	 *
	 * Copyright (c) 2016, 王海彬
	 * All rights reserved.
	 * email: whb883#sina.com
	 */
(function(jq) { 
	jq.fn.multipleSelect = function(options) { //各种属性、参数
		var defaults = { 
			left_head_json:[{th:'th1'},{th:'th2'},{th:'th3'},{th:'th4'},{th:'th5'}],
			right_head_json:[{th:'th1'},{th:'th2'},{th:'th3'},{th:'th4'},{th:'th5'}],
			left_body_json:[{td_key:'1',tds:[{td:'td1'},{td:'td2'},{td:'td3'},{td:'td4'},{td:'td5'}]}],
			right_body_json:[{td_key:'11',tds:[{td:'td1'},{td:'td2'},{td:'td3'},{td:'td4'},{td:'td5'}]},
							{td_key:'11',tds:[{td:'td1'},{td:'td2'},{td:'td3'},{td:'td4'},{td:'td5'}]},
							{td_key:'12',tds:[{td:'td1'},{td:'td2'},{td:'td3'},{td:'td4'},{td:'td5'}]},
							{td_key:'13',tds:[{td:'td1'},{td:'td2'},{td:'td3'},{td:'td4'},{td:'td5'}]}]
		}
			
		var options = $.extend(defaults, options); 
		this.each(function(){ //插件实现代码
			var _this = $(this);
			var left_head = '';
			var right_head = '';
			var left_body = '';
			var right_body = '';
			//封装 左侧 表头
			$.each(options.left_head_json, function(idx, obj) {
				left_head+='<th>'+obj.th+'</th>';
			});
			//封装 右侧 表头
			$.each(options.right_head_json, function(idx, obj) {
				right_head+='<th>'+obj.th+'</th>';
			});
			//封装 左侧 内容
			$.each(options.left_body_json, function(idx, obj) {
				left_body+='<tr class="line td" data-id="'+obj.td_key+'">';
				$.each(obj.tds, function(idx, subobj) {
					left_body+='<td>'+subobj.td+'</td>';
				});
				left_body+='</tr>';
			});
			//封装 右侧 内容
			$.each(options.right_body_json, function(idx, obj) {
				right_body+='<tr class="line td" data-id="'+obj.td_key+'">';
				$.each(obj.tds, function(idx, subobj) {
					right_body+='<td>'+subobj.td+'</td>';
				});
				right_body+='</tr>';
			});
			//填充主体结构
			_this.append('<div class="left"></div>');
			_this.append('<div class="opt"><button class="toRight" type="button">&gt;&gt;</button><button class="toLeft" type="button">&lt;&lt;</button></div>');
			_this.append('<div class="right"></div>');
			_this.append('<div style="clear:both;"></div>');
			//定义并填充表头
			var _this_left = _this.children(".left");
			var _this_right = _this.children(".right");
			_this_left.append('<table class="panel"><tr class="line th">'+left_head+'</tr></table>');
			_this_right.append('<table class="panel"><tr class="line th">'+right_head+'</tr></table>');
			//定义并填充内容
			var _this_left_body = _this_left.children('.panel');
			var _this_right_body = _this_right.children('.panel');
			_this_left_body.append(left_body);
			_this_right_body.append(right_body);
			
			var _this_line = _this.find('.line.td');
			var oldSelectV = $(this).parents(".panel").attr("selectV"); //获取原有选中项值
			var curSelectV = $(this).attr("data-id"); //当前选中值获取
			var selectVArr = [];
			_this_line.live('click',function(){
				$(this).toggleClass("select"); //设定 选中/取消选中 样式
				selectVArr = [];
				if(oldSelectV) {
					selectVArr = oldSelectV.split(","); //设定默认选中项
				}
				var flgIndex = $.inArray(curSelectV, selectVArr); //查询数据已存在此选中项
				if(flgIndex>=0) { //存在则删除
					selectVArr.splice(flgIndex,1);
				}else { //不存在添加
					selectVArr.push(curSelectV);
				}
				$(this).parents(".panel").attr("selectV", selectVArr.join(",")); //放置当前选中项的值
			});
			_this_line.live('hover',function(event){ //鼠标over样式设定
				if(event.type=='mouseenter'){ 
					$(this).addClass("over");
				}else{ 
					$(this).removeClass("over");
				} 				
			});
			var _this_opt_toRight = _this.find('.opt .toRight');
			var _this_leftVObj = _this.find(".left .panel");
			var _this_rightVObj = _this.find(".right .panel");
			_this_opt_toRight.live('click',function(){ //toRight按钮事件
				
				if(_this_leftVObj.attr("selectV") && _this_leftVObj.attr("selectV").length>0) {
					if(_this_rightVObj.attr("selectV") && _this_rightVObj.attr("selectV").length>0){
						_this_rightVObj.attr("selectV",_this_rightVObj.attr("selectV")+","+_this_leftVObj.attr("selectV"));
					}else{
						_this_rightVObj.attr("selectV", _this_leftVObj.attr("selectV"));
					}
					_this_leftVObj.attr("selectV","");
				}
				$.each(_this_leftVObj.find(".select"),function(index, cur){
					_this_rightVObj.append($(this));
				});
				reflushRootV();
				reflushLineColor();
			});
			$(".dselect .opt .toLeft").click(function(){ //toLeft按钮事件
				var _this_leftVObj = $(".dselect .left .panel");
				var _this_rightVObj = $(".dselect .right .panel");
				if(_this_rightVObj.attr("selectV") && _this_rightVObj.attr("selectV").length>0) {
					if(_this_leftVObj.attr("selectV") && _this_leftVObj.attr("selectV").length>0){
						_this_leftVObj.attr("selectV",_this_leftVObj.attr("selectV")+","+_this_rightVObj.attr("selectV"));
					}else{
						_this_leftVObj.attr("selectV", _this_rightVObj.attr("selectV"));
					}
					_this_rightVObj.attr("selectV","");
				}
				$.each(_this_rightVObj.find(".select"),function(index, cur){
					_this_leftVObj.append($(this));
				});
				reflushRootV();
				reflushLineColor();
			});
			//定义属性左右表格数据 增加到根元素属性上，如果用户自定义数据对象，也输送数据
			var reflushRootV = function(){
				var _this_line_left = _this.find('.left .line.td');
				var _this_line_right = _this.find('.right .line.td');
				var _this_line_left_v = [];
				var _this_line_right_v = [];
				_this_line_left.each(function(i,obj){
					_this_line_left_v.push($(this).attr("data-id"));
				});
				_this_line_right.each(function(){
					_this_line_right_v.push($(this).attr("data-id"));
				});
				_this.attr("leftV",_this_line_left_v);
				_this.attr("rightV",_this_line_right_v);
				
				var usrExtValueLeft=$(options.ext_value_left);
				var usrExtValueRight=$(options.ext_value_right);
				if(usrExtValueLeft.length>0) {
					usrExtValueLeft.val(_this_line_left_v);
				}
				if(usrExtValueLeft.length>0) {
					usrExtValueRight.val(_this_line_right_v);
				}
			};
			//刷新隔行变色
			var reflushLineColor = function() {
				_this.find('.line.td:even').removeClass("evenrowcolor").removeClass("oddrowcolor").addClass("evenrowcolor");
				_this.find('.line.td:odd').removeClass("evenrowcolor").removeClass("oddrowcolor").addClass("oddrowcolor");
			};
			
		
			reflushRootV();
			reflushLineColor();
		}); 
	}
})(jQuery);
