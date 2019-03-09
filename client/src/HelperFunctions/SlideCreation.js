export function newSlide (props) {
	let {type, box, words, slideIndex, fontSize, background, brightness, boxes, textFontSize} = props;
	//use title
	if(!words)
		words = ' ';
	if(!box)
		box = {brightness: 100, height: 100, width: 100, x: 0, y: 0, fontSize: fontSize,
			background: '', fontColor: 'rgba(255, 255, 255, 1)'};

	if(boxes && words)
		for(let i = 0; i < boxes.length; ++i)
			if(words[i])
				boxes[i].words = words[i];

	if(type === 'Announcement' && !boxes){
		boxes = [];
		let obj = Object.assign({}, box);
		obj.words = ' ';
		boxes.push(obj);
		obj = Object.assign({}, box);
		obj.height = 23;
		obj.fontSize = 2.1;
		obj.fontColor = 'rgba(255, 251, 43, 1)';
		obj.transparent = true;
		obj.topMargin = 1;
		obj.sideMargin = 2.5;
		obj.excludeFromOverflow = true;
		obj.words = words ? words[0] : ' ';
		boxes.push(obj);
		obj = Object.assign({}, box);
		obj.height = 77;
		obj.y = 23;
		obj.fontSize = textFontSize || 1.9;
		obj.textAlign = 'left';
		obj.transparent = true;
		obj.topMargin = 1;
		obj.sideMargin = 2.5;
		obj.excludeFromOverflow = true;
		obj.words = words ? words[1] : ' ';
		boxes.push(obj);
	}
	else if(!boxes && type === 'timer'){
		boxes = [];
		let obj = Object.assign({}, box);
		obj.words = ' ';
		obj.excludeFromOverflow = true;
		boxes.push(obj);
		obj = Object.assign({}, box);
		obj.transparent = true;
		obj.y = 30;
		obj.height = 35;
		obj.topMargin = 3;
		obj.sideMargin = 4;
		obj.words = words;
		boxes.push(obj);
	}
	else if(!boxes) {
		boxes = [];
		let obj = Object.assign({}, box);
		obj.words = ' ';
		obj.excludeFromOverflow = true;
		boxes.push(obj);
		obj = Object.assign({}, box);
		obj.transparent = true;
		obj.topMargin = 3;
		obj.sideMargin = 4;
		obj.words = words;
		boxes.push(obj);
	}

	let obj = {
		type: type,
		boxes: JSON.parse(JSON.stringify(boxes))
	};

	if(type === 'Announcement')
		obj.duration = 10;
	if(type === 'Announcement Title')
		obj.duration = 5;

	if(slideIndex >= 0)
		obj.boxes[1].slideIndex = slideIndex;
	if(fontSize)
		obj.boxes[1].fontSize = fontSize;
	if(background)
		obj.boxes[0].background = background;
	if(brightness)
		obj.boxes[0].brightness = brightness;

	return obj;

}
