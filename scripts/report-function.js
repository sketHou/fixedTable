/**
 * 锁定表格首行首列
 */

(function ($) {
	$.fn.extend({
		'freezeTable': function (obj) {
			return new FreezeTable(this, obj);
		}
	});


	function FreezeTable(elem, obj){
			this.elem = elem;
			this.origintitle = $.extend(true, [], obj.title);
			this.firsttitle = [obj.title.shift()];
			this.lasttitle = [obj.title.pop()]
			this.realtitle = [obj.title];
			this.orignData = $.extend(true, [], obj.data);
			this.firstData = this.seperateData(obj.data);
			this.data = obj.data;
			this.columnDefs = obj.columnDefs;

			this.leftArea = $('<div class="leftarea"></div>');
			this.leftDiv1 = $('<div class="leftdiv1"></div>');
			this.leftDiv2 = $('<div class="leftdiv2"></div>');
		
			this.centerArea = $('<div class="centerarea"></div>');
			this.centerDiv1 = $('<div class="centerdiv1"></div>');
			this.centerDiv2 = $('<div class="centerdiv2"></div>');

			this.rightArea = $('<div class="rightarea"></div>'); 
			this.rightDiv1 = $('<div class="rightdiv1"></div>');
			this.rightDiv2 = $('<div class="rightdiv2"></div>');

			//左侧部分
			this.leftDiv1.append(this.createTable(this.firsttitle));
			this.leftDiv2.append(this.createTable(this.firstData));
			this.leftArea.append(this.leftDiv1);
			this.leftArea.append(this.leftDiv2);

			//中间title部分
			this.centerDiv1.append(this.createHeaderTable(this.realtitle[0]));
			this.centerDiv2.append(this.createHeaderZeroTable(this.realtitle[0], this.data));
			this.centerArea.append(this.centerDiv1);
			this.centerArea.append(this.centerDiv2);

			//右侧部分
			this.editTable = this.returnEditTable(this.data);
			this.rendertable(this.editTable, this.orignData, this.columnDefs);
			this.rightDiv1.append(this.createTable(this.lasttitle));
			this.rightDiv2.append(this.editTable);
			this.rightArea.append(this.rightDiv1);
			this.rightArea.append(this.rightDiv2);

			this.elem.html('');
			this.elem.append(this.leftArea);
			this.elem.append(this.centerArea);
			this.elem.append(this.rightArea);
			
			var _this = this;
			this.centerDiv2.bind('scroll', function(){
				var center_div2_top = this.scrollTop;
				var center_div2_left = this.scrollLeft;
				_this.leftDiv2.scrollTop(center_div2_top);
				_this.rightDiv2.scrollTop(center_div2_top);
				_this.centerDiv1.scrollLeft(center_div2_left);
			});

			this.setWidth();
	}

	FreezeTable.prototype.createHeaderTable = function(titleData, contentData){
		var _this = this;
		var table = $('<table class="table table-bordered table-hover table-striped"></table>');
		var thead = $('<thead></thead>');
		var tbody = $('<tbody></tbody>');
		var headTr = $('<tr></tr>');
		$.each(titleData, function(index, item){
			var th = $('<th>' + item + '</th>');
			headTr.append(th);			
		});
		thead.append(headTr);	
		table.append(thead);

		if(!contentData){
			return table
		}
		$.each(contentData, function(index, item){
			var tr = $('<tr></tr>');
			$.each(item, function(index, val){
				var td = $('<td>' + val + '</td>')
				tr.append(td);
			});
			tbody.append(tr);
		});			
		
		table.append(tbody);

		return table
	}

	FreezeTable.prototype.createHeaderZeroTable = function(titleData, contentData){
		var _this = this;
		var table = $('<table class="table table-bordered table-hover table-striped"></table>');
		var thead = $('<thead></thead>');
		var tbody = $('<tbody></tbody>');
		var headTr = $('<tr style="height:0; overflow: hidden;"></tr>');
		$.each(titleData, function(index, item){
			var th = $('<th style="height:0; overflow: hidden;"><div style="height:0; overflow: hidden;">' + item + '</div></th>');
			headTr.append(th);			
		});
		thead.append(headTr);	
		table.append(thead);

		if(!contentData){
			return table
		}
		$.each(contentData, function(index, item){
			var tr = $('<tr></tr>');
			$.each(item, function(index, val){
				var td = $('<td>' + val + '</td>')
				tr.append(td);
			});
			tbody.append(tr);
		});			
		
		table.append(tbody);

		return table
	}


	FreezeTable.prototype.createTable = function (data){
		var _this = this;
		var table = $('<table class="table table-bordered table-hover table-striped"><tbody></tbody></table>');
		$.each(data, function(index, item){
			var tr = $('<tr></tr>');
			if(!$.isArray(item)) {
				var td = $('<td>' + item + '</td>')
				tr.append(td);
			}else{
				$.each(item, function(index, val){
					var td = $('<td>' + val + '</td>')
					tr.append(td);
				});
			}
			table.find('tbody').append(tr);
		});
		return table
	}

	FreezeTable.prototype.seperateData = function (data){
		var firstData = []
		$.each(data, function(index, item){
			firstData.push(item.shift());
		});
		return firstData;
	}

	FreezeTable.prototype.rendertable = function (dataTable, data, columnDefs){
		var rows = dataTable.find('tr');
		$.each(columnDefs, function(index, def){
			$.each(rows, function(index, row){
				var $row = $(row);
				var td = $row.find('td').last();
				if(td.length == 0){ td = $('<td></td>')}
				td.html($(def.render(data[index], index)));
				$row.append(td);
			});
		});
	}

	FreezeTable.prototype.returnEditTable = function (data) {
		var table = $('<table class="table table-bordered table-hover table-striped"><tbody></tbody></table>');
		$.each(data, function(index, item){
			var tr = $('<tr></tr>');
			table.find('tbody').append(tr);
		});
		return table		
	}

	FreezeTable.prototype.addRow = function(data){
		var leftDiv2 = this.leftDiv2;//首列dom
		var centerDiv2 = this.centerDiv2;//中间列dom
		var rightDiv2 = this.rightDiv2;//右侧编辑列dom

		var orignData = this.orignData;//全部的数据
		var firstData = this.firstData;//首列数据
		var centerdata = this.data;//中间列数据
		var columnDefs = this.columnDefs; //自定义的html
		
		var _orignData = $.extend(true, [], data);

		//firstData 添加 并渲染
		var _firstData = data.shift();
		firstData.push(_firstData);
		leftDiv2.children().find('tbody').append('<tr><td>' + _firstData + '</td></tr>');
		
		//centerdata 添加 并渲染
		var _centerdata = data;
		centerdata.push(_centerdata);
		var tr = $('<tr></tr>');
		$.each(_centerdata, function(index, val){
			tr.append('<td>' + val + '</td>');
		});
		centerDiv2.children().find('tbody').append(tr);

		//edit 添加
		orignData.push(_orignData);
		var tr2 = $('<tr><td></td></tr>');
		tr2.children().eq(0).html($(columnDefs[0].render(orignData[orignData.length - 1], orignData.length - 1)));
		rightDiv2.children().find('tbody').append(tr2);

		this.setWidth();
	}

	FreezeTable.prototype.delRow = function(index){
		var leftDiv2 = this.leftDiv2;//首列dom
		var centerDiv2 = this.centerDiv2;//中间列dom
		var rightDiv2 = this.rightDiv2;//右侧编辑列dom

		var orignData = this.orignData;//全部的数据
		var firstData = this.firstData;//首列数据
		var centerdata = this.data;//中间列数据
		
		leftDiv2.children().find('tbody').children().eq(index).remove();
		centerDiv2.children().find('tbody').children().eq(index).remove();
		orignData.splice(index, 1);
		firstData.splice(index, 1);
		centerdata.splice(index, 1);

		this.editTable = this.returnEditTable(centerdata);
		this.rendertable(this.editTable, orignData, this.columnDefs);
		rightDiv2.html(this.editTable);

		this.setWidth();
	}


	FreezeTable.prototype.editRow = function(index, data){
		var leftDiv2 = this.leftDiv2;//首列dom
		var centerDiv2 = this.centerDiv2;//中间列dom
		var rightDiv2 = this.rightDiv2;//右侧编辑列dom

		var orignData = this.orignData;//全部的数据
		var firstData = this.firstData;//首列数据
		var centerdata = this.data;//中间列数据
		
		var centerRow = centerDiv2.children().find('tbody').children().eq(index);
		var leftRow = leftDiv2.children().find('tbody').children().eq(index);

		$.each(orignData[index], function(i, item){
			var newData = data[i];
			item = newData;
			if(i == 0){//firstdata
				firstData[index] = item;
				leftRow.find('td').html(item);
			}else{//centerdata
				centerdata[index][i - 1] = item;
				centerRow.children().eq(i - 1).html(newData);
			}
		});


		this.editTable = this.returnEditTable(centerdata);
		this.rendertable(this.editTable, orignData, this.columnDefs);
		rightDiv2.html(this.editTable);

	}


	FreezeTable.prototype.setWidth = function(){
		var _this = this;
		var centerArea = _this.centerArea;
		var centerDiv2 = _this.centerDiv2;
		var centerDiv1 = _this.centerDiv1;
		var centerTable1 = centerDiv1.find('table');
		var centerTable2 = centerDiv2.find('table');

		var dataTdList = centerDiv2.find('thead').find('th');
		var titleTdList = centerDiv1.find('thead').find('th');
		dataTdList.css('height', 0);
		var totalWidth = 0;
		$.each(dataTdList, function(index, td){
			var dataTdWith = Number($(td).outerWidth());
			if(dataTdWith < 100){
				dataTdWith = 100;
			}
			totalWidth = totalWidth + dataTdWith;
			titleTdList[index].style.width = dataTdWith + 'px';
			td.style.width = dataTdWith + 'px'; 
		});

		var centerAreaWidth = centerArea.width();
		if(totalWidth < centerAreaWidth){
			centerTable1.width(centerAreaWidth);
			centerTable2.width(centerAreaWidth);
			// var outerWidth = centerDiv2.find('table').outerWidth(true);
			centerDiv1.width(centerAreaWidth);
			centerDiv2.width(centerAreaWidth);
			return;
		}
		centerTable1.width(totalWidth);
		centerTable2.width(totalWidth);
		var outerWidth = centerDiv2.find('table').outerWidth(true);
		centerDiv1.width(outerWidth);
		centerDiv2.width(outerWidth);

	}

})(jQuery);