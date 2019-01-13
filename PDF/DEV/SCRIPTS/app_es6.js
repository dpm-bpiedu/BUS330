(function pdfSetup() {
	'use strict';

	const util = {
		setAttributes: (elem, attrs) => {
			Object.keys(attrs).forEach(attr => {
				elem.setAttribute(attr, attrs[attr]);
			});
		},
		setElem: (el, child, attrs) => {
			const elem = el => {
				let createdEl = document.createElement(el);
				return createdEl;
			};

			const elemText = text => {
				let createdText = document.createTextNode(text);
				return createdText;
			};

			let newEl = elem(el),
				childIsString = (typeof child === 'string'),
				noChild = (child === false),
				childIsObject = (typeof child !== 'string' && child !== false);

			util.setAttributes(newEl, attrs);

			if(noChild) {
				return newEl;
			} else if(childIsString) {
				let newElText = elemText(child);
				newEl.appendChild(newElText);
				return newEl;
			} else if(childIsObject) {
				newEl.appendChild(child);
				return newEl;
			} else {
				console.log("ERROR: child should be text, object, or false");
				return;
			}

		},
		appendElems: (parent, childArr) => {
			for(let i = 0; i < childArr.length; i++) {
				parent.appendChild(childArr[i]);
			}
		}
	};

	const toc = {
		container: document.getElementById('printTOC'),
		headObjects: [],
		make: () => {

			const navBrief = util.setElem('nav', false, {'id': 'navBrief'}),
				  navDetail = util.setElem('nav', false, {'id': 'navBrief'}),
				  headBrief = util.setElem('h1', 'Contents', {'class': 'contents-title'}),
				  headDetail = util.setElem('h1', 'Detailed Contents', {'class': 'contents-title'}),
				  listBrief = util.setElem('ul', false, {'id': 'listBrief', 'class': 'nav-list'}),
				  listDetail = util.setElem('ul', false, {'id': 'listDetail', 'class': 'nav-list'});

			toc.headObjects.forEach((obj, index) => {

				let spanNumber, spanText;

				if(obj.text === undefined) {

					console.log("ERROR: incorrect data attribute", obj.type);

				} else if (obj.type === 'ch-title') {

					const makeChTitle =() => {
						spanNumber = util.setElem('span', obj.number, { 'class': 'chNum'});
						spanText = util.setElem('span', obj.text, {'class': 'chText'});

						let a = util.setElem('a', spanNumber, {'class': `${obj.type}`, 'href': `${obj.href}`});
						a.appendChild(spanText);
						let li = util.setElem('li', a, {'class': 'list-item'});

						return li;

					};

					listBrief.appendChild(makeChTitle());
					listDetail.appendChild(makeChTitle());

				} else if(obj.type === 'ch-h1') {

					const makeSecTitle = () => {
						spanNumber = util.setElem('span', obj.number, { 'class': 'chNum'});
						spanText = util.setElem('span', obj.text, {'class': 'chText'});

						let a = util.setElem('a', spanNumber, {'class': `${obj.type}`, 'href': `${obj.href}`});
						a.appendChild(spanText);
						let li = util.setElem('li', a, {'class': 'list-item'});

						return li;

					};

					listDetail.appendChild(makeSecTitle());

				} else {

					const makeOther = () => {
						let a = util.setElem('a', obj.text, {'class': `${obj.type}`, 'href': `${obj.href}`});
						let li = util.setElem('li', a, {'class': 'list-item'});

						return li;

					};

					let isDetailOnly = obj.detailOnly ?
						listDetail.appendChild(makeOther())
					:
						(listBrief.appendChild(makeOther()), listDetail.appendChild(makeOther()));

				}
			});

			util.appendElems(navBrief, [headBrief, listBrief]);
			util.appendElems(navDetail, [headDetail, listDetail]);
			util.appendElems(toc.container, [navBrief, navDetail]);

		},

};

	const heads = {
		extract: () => {
			let tocHeads = document.querySelectorAll('[data-toc]');
			tocHeads.forEach((tocHead, index) => {
				heads.handle(tocHead, index);
			});
		},
		handle: (obj, index) => {
			let headObj = {};
			obj.setAttribute('id', `toc_${(index + 1)}`);

			// assign values for headObj type and href
			headObj.type = obj.getAttribute('data-toc');
			headObj.href = `#toc_${(index + 1)}`;

			// assign values for headObj for number and text depending on type
			switch(headObj.type) {

				// if chapter title
				case 'ch-title':

					let chNum = obj.querySelector('[data-ch-title=number]'),
						chText = obj.querySelector('[data-ch-title=text]');

					headObj.detailOnly = false;
					headObj.number = `Chapter ${chNum.textContent} `;
					headObj.text = chText.textContent;

					chNum.insertAdjacentHTML('afterbegin', '<span class="hidden">Chapter </span>');
					chNum.setAttribute('data-head', 'tl');
					chText.setAttribute('data-head', 'tr');

					break;

				// if numbered section
				case 'ch-h1':

					let secNum = obj.querySelector('[data-ch-h1=number]'),
						secText = obj.querySelector('[data-ch-h1=text]');

					headObj.detailOnly = true;
					headObj.number = `${secNum.textContent} `;
					headObj.text = secText.textContent;

					secNum.insertAdjacentHTML('afterbegin', '<span class="hidden">Section </span>');
					secNum.setAttribute("data-head", "tl");
					secText.setAttribute("data-head", "tr");

					break;

				// if unumbered section, h2, or eoc
				case 'ch-h1-un':
				case 'ch-h1-box':
				case 'ch-h2':
				case 'ch-h1-eoc':
				case 'ch-h2-eoc':
				case 'bm-h2':

					headObj.detailOnly = true;
					headObj.text = obj.textContent;

					break;

				// if front or backmatter
				case 'fm-h1':
				case 'bm-h1':

					headObj.detailOnly = false;
					headObj.text = obj.textContent;

					break;

				// Error
				default:
					console.log("ERROR: incorrect data attribute.", obj.textContent);
			}

			toc.headObjects.push(headObj);

		}
	};

	heads.extract();
	console.log(toc.headObjects);
	toc.make();

}());