let timer = null;
let countdown = null;
export function setSlideBackground(props){
	let {background} = props;
	let {updateState, updateHistory} = props.parent;
	let {item, wordIndex, allItems, itemList, itemIndex, needsUpdate} = props.parent.state;

	let slides;
	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides || null;
	else
		slides = item.slides || null;

	slides[wordIndex].boxes[0].background = background;
	let index = allItems.findIndex(e => e.name === item.name);
	needsUpdate.updateItem = true;

	if(wordIndex === 0){
		itemList[itemIndex].background = background;
		allItems[index].background = background;
		item.background = background;
		needsUpdate.updateAllItems = true;
		needsUpdate.updateItemList = true;
		updateHistory({type: 'update', item: item, itemList: itemList});
		updateState({allItems: allItems, itemList: itemList, needsUpdate: needsUpdate});
	}
	else{
		updateHistory({type: 'update', item: item});
		updateState({ item: item, needsUpdate: needsUpdate});
	}

}

export function setWordIndex(props){
	let {index} = props;
	let {updateState} = props.parent;
	let {item, wordIndex} = props.parent.state;
	let slides;

	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides;
	else
		slides = item.slides;

	let scrollTo = index;

	if(index > wordIndex && index+1 < slides.length)
		scrollTo+=1;
	if(index < wordIndex && index > 0){
		scrollTo-=1;
	}

	var mElement = document.getElementById('MSlide'+scrollTo);
	var element = document.getElementById('Slide'+scrollTo);
	if(mElement)
		mElement.scrollIntoView({behavior: 'instant', block: 'nearest', inline:'nearest'});
	if(element)
		element.scrollIntoView({behavior: 'instant', block: 'nearest', inline:'nearest'});

	const slide = slides[index];
	let lastBox;
	if(slide){
		lastBox = slide.boxes.length - 1;
	}
	
	updateState({wordIndex: index, boxIndex: lastBox || 0});
	clearTimer();
	clearCountdown();
	updateSlide(props);
}

export function clearTimer(){
	clearTimeout(timer);
}
export function clearCountdown(){
	clearInterval(countdown);
}
function updateSlide(props){
	let {index} = props;
	let {updateCurrent, setItemIndex} = props.parent;
	let {item, freeze, itemIndex, itemList} = props.parent.state;
	let slides;
	if(freeze){
		clearTimer();
		return;
	}

	if (item.type === 'song')
		slides = item.arrangements[item.selectedArrangement].slides;
	else
		slides = item.slides;

	updateCurrent({slide: slides[index], isBible: item.type === 'bible', name: item.name, isAnnouncement: item.type === 'announcements'});

	if(item.type === 'announcements'){
		let length = item.slides.length;
		if(!item.slides[index]){
			return;
		}
		let duration = item.slides[index].duration * 1000;
		timer = setTimeout(function(){
			if(index < length-1) {
				props.index++;
				updateSlide(props);
			}
			else {
				props.index = 0;
				updateSlide(props);
			}
		},duration);

	}
	else if (item.type === 'timer'){
		let {hours, minutes, seconds} = item;
		let hoursString = '0';
		let minutesString = '0';
		let secondsString = '0';
		countdown = setInterval(() => {
			if(seconds === 0 && minutes === 0 && hours > 0){
				seconds = 59;
				minutes = 59;
				--hours;
			}
			else if(seconds === 0 && minutes > 0){
				seconds = 59;
				--minutes;
			}
			else if(seconds > 0)
				--seconds;
			else{
				clearCountdown();
				if(item.nextOnFinish && itemIndex < itemList.length-1)
					setItemIndex(itemIndex+1);
			}

			if(hours >= 0 && hours <= 9)
				hoursString = '0' + hours;
			else
				hoursString = hours;
			if(minutes >= 0 && minutes <= 9)
				minutesString = '0' + minutes;
			else
				minutesString = minutes;
			if(seconds >= 0 && seconds <= 9)
				secondsString = '0' + seconds;
			else
				secondsString = seconds;
			let words = `${hoursString}:${minutesString}:${secondsString}`;
			let slide = JSON.parse(JSON.stringify(item.slides[index]));
			slide.boxes[1].words = words;
			updateCurrent({slide: slide});
		},1000);
	}

}
