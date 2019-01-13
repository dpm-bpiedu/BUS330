// JQuery script
(function pdfSetup() {
'use strict';
	
var util = {
	getStrings: function(str, strBreak) {
		var obj = {};
		var breakIndex = str.indexOf(strBreak);
		obj.string1 = str.slice(0, breakIndex);
		obj.string2 = str.slice((breakIndex + 1));
		return obj;
	},
	isNumber: function(index, str) {
		var boolVal = isNaN(str.charAt(index)) ? false : true;
		return boolVal;
	},
	makeHeading: function(headingText, attrs) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		var aText = document.createTextNode(headingText);
		
		a.appendChild(aText);
		util.setAttributes(a, attrs);
		
		li.appendChild(a);
			
		return li;
			
	},
	setAttributes: function(elem, attrs) {
		Object.keys(attrs).forEach(function(attr) {
			elem.setAttribute(attr, attrs[attr]);
		});
	}	
};
	
var toc = {
	container: $("#printTOC"),
	headObjects: [],
	make: function() {
		
		heads.extract();
	
		var brief = $("<nav>")
			 .append(
				 $("<h1>")
				 .addClass("h1")
				 .text("Brief Contents")
				 ),
			briefList = $("<ul>"),
			detail = $("<nav>")
				 .append(
				 $("<h1>")
				 .addClass("h1")
				 .text("Contents")
				 ),
			detailList = $("<ul>");

		for (var i = 0; i < this.headObjects.length; i++) {
			var obj = this.headObjects[i];
			
			if(obj.detailOnly) {
				$(detailList).append(util.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
			} else {
				$(briefList).append(util.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
				$(detailList).append(util.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
			}
			
		}
		
		$(brief).append(briefList);
		$(detail).append(detailList);

		$(this.container).append(brief);
		$(this.container).append(detail);	
		
  }
};
	
var heads = {
	extract: function() {
		var tocHeads = $('[data-toc]');
		this.handle(tocHeads);
	},
	handle: function(arr) {
		
		arr.each(function(index) {
			var newObj = {},
				el = $(this);
			
			$(el).attr("id", "toc_" + (index + 1));
			
			newObj.type = $(el).attr("data-toc");
		
			// define object properties
			switch(newObj.type) {
				case 'ch-title':
					
					// define object properties
					
					var chNum = $(el).find('[data-ch-title=number]'),
						chTitle = $(el).find('[data-ch-title=text]');
					
					newObj.detailOnly = false;
					newObj.href = "toc_" + (index + 1);
					newObj.text = "Chapter " + $(chNum).text() + " " + $(chTitle).text();					
					
					// reformat element
					
					$(chNum).html("<span data-head='tr'><span class='hidden'>Chapter </span>" + $(chNum).text() + "</span>");
					$(chTitle).html("<span data-head='tl'>" + $(chTitle).text() + "</span>");
					
					break;
					
				case 'ch-h1': 
					
					var objText, strObj, stringNumber, stringText, newHTML;
					
					objText = $(el).text();
					newObj.detailOnly = false;
					newObj.href = "#toc_" + (index + 1);					
					if(util.isNumber(0, objText)) {						
						newObj.hasNumber = true;
						strObj = util.getStrings(objText, " ");
						stringNumber = strObj.string1 + " ";
						stringText = strObj.string2;
						newObj.text = objText;
						newHTML = "<span data-head='tl'><span class='hidden'>Section </span>" + stringNumber + "</span>" + stringText + "<span data-head='tr'></span>";				   
					   } else {
						 newObj.hasNumber = false;
						 newObj.text = objText;
						 newHTML = "<span class='hidden' data-head='tl'></span><span data-head='tr'>" + newObj.text + "</span>";
					   }
					
					$(el).html(newHTML);
					

					break;
					
				case 'fm-h1':
				case 'bm-h1':
					newObj.detailOnly = false;
					newObj.href = "#toc_" + (index + 1);
					newObj.text = $(el).text();
					
					break;
					
				case 'ch-h2':
				case 'ch-h1-eoc':
				case 'ch-h2-eoc':
				case 'bm-h2':

					newObj.detailOnly = true;
					newObj.href = "#toc_" + (index + 1);
					newObj.text = $(el).text();

					break;
					
				default:
					console.log("ERROR: incorrect data attribute.", $(el).text());
					
			}
	
			toc.headObjects.push(newObj);
			
		});
		
	}
};
	
toc.make();
	
}());