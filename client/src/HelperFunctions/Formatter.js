import * as Overflow from './Overflow';

export function updateFontSize(props){

	let {fontSize} = props;
	let {updateState, updateHistory} = props.parent;
	let {item, wordIndex, boxIndex, needsUpdate} = props.parent.state;

	let slides;
	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides || null;
	else
		slides = item.slides || null;
	let slide = slides ? slides[wordIndex] : null;

	if(!slide)
		return;

	if(wordIndex !== 0 && item.type !== 'image'){
		for(let i = 1; i < slides.length; ++i){
			if(!slides[i].boxes[boxIndex].excludeFromOverflow)
				slides[i].boxes[boxIndex].fontSize = fontSize;
		}
	}
	else
		slides[wordIndex].boxes[boxIndex].fontSize = fontSize;



	if(item.type === 'bible' && wordIndex !== 0)
		item = Overflow.formatBible(item, 'edit');

	if(item.type === 'song' && wordIndex !== 0)
		item = Overflow.formatSong(item);

	if(wordIndex >= slides.length)
		wordIndex = slides.length-1;

	needsUpdate.updateItem = true;
	updateHistory({type: 'update', item: item});
	updateState({item: item, wordIndex: wordIndex, needsUpdate: needsUpdate});

}

export function updateFontColor(props){

	let {item, itemList, itemIndex, allItems, wordIndex, boxIndex, needsUpdate} = props.parent.state;
	let {updateState, updateHistory} = props.parent;
	let c = props.fontColor;

	let color = 'rgba('+c.r+' , ' +c.g+' , '+c.b+' , '+c.a+')';
	let slides;
	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides || null;
	else
		slides = item.slides || null;
	let slide = slides ? slides[wordIndex] : null;

	if(!slide)
		return;

	slide.boxes[boxIndex].fontColor = color;
	let index = allItems.findIndex(e => e._id === item._id);

	let background = slide.boxes[boxIndex].background;

	for(let i = 0; i < slides.length; ++i){
		if(slides[i].boxes[0].background === background){
			slides[i].boxes[0].fontColor = color;
			if(i === 0)
			{
				itemList[itemIndex].nameColor = color;
				allItems[index].nameColor = color;
			}
		}
	}


	if(wordIndex === 0 && boxIndex === 0){
		//update color of item in current list
		itemList[itemIndex].nameColor = color;
		//update color of item in full list
		allItems[index].nameColor = color;
	}

	if(item.type === 'bible' && wordIndex !== 0){
		for(let i = 1; i < slides.length; ++i){
			slides[i].boxes[boxIndex].fontColor = color;
		}
	}
	needsUpdate.updateItem = true;
	needsUpdate.updateItemList = true;
	needsUpdate.updateAllItems = true;
	updateHistory({type: 'update', item: item});
	updateState({item: item, itemList: itemList, allItems: allItems, needsUpdate: needsUpdate});


}

export function updateBrightness(props){
	let {item, wordIndex, needsUpdate} = props.parent.state;
	//use boxIndex
	let {updateState, updateHistory} = props.parent;
	let {level} = props;
	let slides;
	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides || null;
	else
		slides = item.slides || null;

	let slide = slides ? slides[wordIndex] : null;

	if(!slide)
		return;

	slide.boxes[0].brightness = level;
	let background = slide.boxes[0].background;
	let words = slide.boxes[1].words || slide.boxes[0].words;

	for(let i = 0; i < slides.length; ++i){
		if(slides[i].boxes[0].background === background && words !== ' ')
			slides[i].boxes[0].brightness = level;
	}

	needsUpdate.updateItem = true;
	updateHistory({type: 'update', item: item});
	updateState({item: item,needsUpdate: needsUpdate});

}

export function updateBoxPosition(props){
	let {item, wordIndex, boxIndex} = props.parent.state;
	let {x, y, width, height, applyAll, match} = props.position;

	let slides;
	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides || null;
	else
		slides = item.slides || null;

	let slide = slides ? slides[wordIndex] : null;

	if(!slide)
		return;

	if(match){
		let box = slides[wordIndex].boxes[boxIndex];
		x = box.x;
		y = box.y;
		width = box.width;
		height = box.height;
	}

	if (!applyAll){
		let box = slides[wordIndex].boxes[boxIndex];
		box.x = x;
		box.y = y;
		box.width = width;
		box.height = height;
		slides[wordIndex].boxes[boxIndex] = box;
	}
	else{
		for(let i = 1; i < slides.length; ++i){
			let box = slides[i].boxes[boxIndex];
			box.x = x;
			box.y = y;
			box.width = width;
			box.height = height;
		}
	}
	props.parent.updateItem(item);
}
