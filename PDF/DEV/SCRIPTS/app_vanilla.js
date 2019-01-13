// Vanilla script
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
	newEl: {
		empty: function(el, attrs) {
			var newEl = document.createElement(el);
			util.setAttributes(newEl, attrs);
			
			return newEl;
		},
		wText: function(el, text, attrs) {
			var newEl = document.createElement(el);
			var newText = document.createTextNode(text);
			
			util.setAttributes(newEl, attrs);
			
			newEl.appendChild(newText);
			
			return newEl;			
			
		},
		wChildren: function(el, childrenArr, attrs) {
			var newEl = document.createElement(el);
			
			util.setAttributes(newEl, attrs);
			
			for (var i = 0; i < childrenArr.length; i++) {
				newEl.appendChild(childrenArr[i]);
			}
			
			return newEl;
		}
	},
	setAttributes: function(elem, attrs) {
		Object.keys(attrs).forEach(function(attr) {
			elem.setAttribute(attr, attrs[attr]);
		});
	}	
};
	
var toc = {
	container: document.getElementById("printTOC"),
	headObjects: [],
	makeHeading: function(headingText, attrs) {
		var a = util.newEl.wText("a", headingText, attrs);
		var li = util.newEl.wChildren("li", [a], {"class": "toc_item"});
		
		return li;
	},
	make: function() {
		
		heads.extract();
		
		// define TOC container elements
		var briefHeading = util.newEl.wText("h1", "Brief Contents", {"class": "h1"});
		var brief = util.newEl.wChildren("nav", [briefHeading], {"class": "briefNav"});
		var briefList = util.newEl.empty("ul", {"id": "briefList"});
		
		var detailHeading = util.newEl.wText("h1", "Contents", {"class": "h1"});
		var detail = util.newEl.wChildren("nav", [detailHeading], {"class": "briefNav"});
		var detailList = util.newEl.empty("ul", {"id": "detailList"});		
	
		// append list items to appropriate lists
		for (var i = 0; i < this.headObjects.length; i++) {
			var obj = this.headObjects[i];
			
			if(obj.detailOnly) {
				detailList.appendChild(toc.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
			} else {
				briefList.appendChild(toc.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
				detailList.appendChild(toc.makeHeading(obj.text, {"class": obj.type, "href": obj.href}));
			}
			
		}
		
		// append lists to nav elements
		brief.appendChild(briefList);
		detail.appendChild(detailList);

		// append nav elements to print TOC container
		this.container.appendChild(brief);
		this.container.appendChild(detail);

  }
};
	
var heads = {
	extract: function() {
		var tocHeads = document.querySelectorAll('[data-toc]'), i;
		
		for (i = 0; i < tocHeads.length; i++) {
			heads.handle(tocHeads[i], i);
		}

	},
	handle: function(obj, index) {
		
		var headObj = {};
		obj.setAttribute('id', "toc_" + (index + 1));
		
		// assign values for headObj type and href
		
		headObj.type = obj.getAttribute('data-toc');
		headObj.href = "#toc_" + (index + 1);
		
		switch(headObj.type) {
			case 'ch-title':
				var chNum = obj.querySelector('[data-ch-title=number]'),
					chText = obj.querySelector('[data-ch-title=text]');

				headObj.detailOnly = false;
				headObj.number = "Chapter " + chNum.textContent;
				headObj.text = headObj.number + " " + chText.textContent;

				chNum.insertAdjacentHTML('afterbegin', '<span class="hidden">Chapter </span>');
				chNum.setAttribute('data-head', 'tl');
				chText.setAttribute('data-head', 'tr');

					break;
				
			case 'ch-h1':
			case 'ch-h1-eoc':
					var objText, strObj, stringNumber, stringText, newHTML;
					
					objText = obj.textContent;
					headObj.detailOnly = false;
					if(util.isNumber(0, objText)) {						
						headObj.hasNumber = true;
						strObj = util.getStrings(objText, " ");
						stringNumber = strObj.string1 + " ";
						stringText = strObj.string2;
						headObj.text = objText;
						newHTML = "<span data-head='tl'><span class='hidden'>Section </span>" + stringNumber + "</span>" + stringText + "<span data-head='tr'></span>";				   
					   } else {
						 headObj.hasNumber = false;
						 headObj.text = objText;
						 newHTML = "<span class='hidden' data-head='tl'></span><span data-head='tr'>" + headObj.text + "</span>";
					   }
					
					obj.innerHTML = newHTML;
				
				break;
				
			case 'fm-h1':
			case 'bm-h1':
				headObj.detailOnly = false;
				headObj.text = obj.textContent;
				
				break;
				
			case 'ch-h2':
			case 'ch-h2-eoc':
			case 'fm-h2':
			case 'bm-h2':
				headObj.detailOnly = true;
				headObj.text = obj.textContent;
				
				break;
				
			default:
				console.log("ERROR: incorrect data attribute", obj.type);
				
				break;
		}
		
		toc.headObjects.push(headObj);
		
	}

};	
	
toc.make();
	
}());