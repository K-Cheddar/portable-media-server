import * as SlideCreation from './SlideCreation';

export function formatSong(item) {
	let newSlides = formatLyrics(item);

	item.arrangements[item.selectedArrangement].slides = newSlides;

	let slides = item.arrangements[item.selectedArrangement].slides;

	let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
	let songOrder = item.arrangements[item.selectedArrangement].songOrder;
	for (let i = 0; i < formattedLyrics.length; ++i) {
		let type = formattedLyrics[i].name;
		let counter = 0;
		let songOrderCounter = 0;
		let slideSpan = 0;

		for (let j = 0; j < songOrder.length; j++) {
			if (type === songOrder[j]) ++songOrderCounter;
		}
		for (let j = 0; j < slides.length; j++) {
			if (type === slides[j].type) ++counter;
		}
		if (songOrderCounter !== 0) {
			slideSpan = counter / songOrderCounter;
		} 
		else slideSpan = counter;
		formattedLyrics[i].slideSpan = slideSpan;
	}
	return item;
}

export function formatLyrics(item) {
	let slides = item.arrangements[item.selectedArrangement].slides || null;

	let boxes = slides[0].boxes;
	let lastSlide = slides.length - 1;
	let lastBoxes = slides[lastSlide].boxes;
	let newSlides = [
		SlideCreation.newSlide({
			type: 'Title',
			boxes: slides[0].boxes,
			words: boxes[0].words,
		}),
	];
	let songOrder = item.arrangements[item.selectedArrangement].songOrder;
	let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics;
	let fontSize = slides[1] ? slides[1].boxes[1].fontSize : 2.5;

	for (let i = 0; i < songOrder.length; ++i) {
		let lyrics = formattedLyrics.find((e) => e.name === songOrder[i]).words;
		newSlides.push(...formatSection(lyrics, songOrder[i]));
	}

	function formatSection(lyrics, type) {
		let lines = lyrics.split('\n');
		let fLyrics = [],
			currentBoxes = [],
			boxes = [];
		let box = {};
		//lineContainer = {}
		let maxLines = 0,
			lineHeight = 0,
			lineCounter = 0,
			counter = 0;
		let boxWords = '';

		for (let i = 0; i < lines.length; ++i) {
			counter = 0;
			lineCounter = 0;
			boxWords = '';
			boxes = [];

			if (slides[newSlides.length + fLyrics.length])
				currentBoxes = slides[newSlides.length + fLyrics.length].boxes;
			else currentBoxes = lastBoxes;

			for (let j = 0; j < currentBoxes.length; ++j) {
				({ maxLines, lineHeight } = getMaxLines(
					fontSize,
					currentBoxes[1].height
				));

				while (i + counter < lines.length && lineCounter < maxLines) {
					boxWords += lines[i + counter];
					if (i + counter < lines.length - 1) boxWords += '\n';

					let lineCount = getNumLines(
						lines[i + counter],
						fontSize,
						lineHeight,
						currentBoxes[1].width
					);
					if (lineCount === 0) lineCount = 1;
					lineCounter += lineCount;
					counter++;
				}
				box = Object.assign({}, currentBoxes[j]);
				if (boxWords === '') boxWords = ' ';
				box.words = boxWords;
				boxes.push(box);
			}
			boxes[0].words = ' ';
			boxes[1].excludeFromOverflow = false;
			i += counter - 1;
			fLyrics.push(
				SlideCreation.newSlide({
					type: type,
					boxes: boxes,
					fontSize: fontSize,
					slideIndex: fLyrics.length,
				})
			);
		}
		return fLyrics;
	}
	newSlides.push(SlideCreation.newSlide({ type: 'blank', box: lastBoxes[0] }));
	return newSlides;
}

export function formatBible(item, mode, verses, fit) {
	let slides = item.slides;
	let boxes = slides[0].boxes;
	let newSlides = [
		SlideCreation.newSlide({
			type: 'Title',
			fontSize: 4.5,
			words: boxes[1].words,
			background: boxes[0].background,
			brightness: boxes[0].brightness,
		}),
	];
	if (verses) newSlides.push(...formatBibleVerses(verses, item, mode));
	else newSlides.push(...formatBibleVerses('', item, mode));

	item.slides = newSlides;
	return item;
}

function formatBibleVerses(verses, item, mode) {
	let slides = item.slides;
	let currentSlide = slides[1];
	// let allBoxes = slides.flatMap(x => x.boxes);
	// let overflowBoxes = allBoxes.filter(e => !e.excludeFromOverflow)
	let currentBoxes = currentSlide.boxes;
	let { maxLines, lineHeight } = getMaxLines(
		currentBoxes[1].fontSize,
		currentBoxes[1].height
	);
	let formattedVerses = [];
	let slide = '';
	let type = currentSlide.type;
	let fitProcessing = true;

	if (mode === 'create') {
		for (let i = 0; i < verses.length; ++i) {
			let words = verses[i].text.split(' ');
			if (slide[slide.length - 1] === ' ')
				slide = slide.substring(0, slide.length - 1);
			slide += '{' + verses[i].verse + '}';

			for (let j = 0; j < words.length; j++) {
				let update = slide + words[j];
				if (
					getNumLines(
						update,
						currentBoxes[1].fontSize,
						lineHeight,
						currentBoxes[1].width
					) <= maxLines
				)
					slide = update + ' ';
				else {
					slide = slide.replace(/\s+/g, ' ').trim();
					formattedVerses.push(
						SlideCreation.newSlide({
							type: 'Verse ' + verses[i].verse,
							boxes: currentBoxes,
							words: [0, slide],
						})
					);
					slide = words[j] + ' ';
				}
			}
			formattedVerses.push(
				SlideCreation.newSlide({
					type: 'Verse ' + verses[i].verse,
					boxes: currentBoxes,
					words: [0, slide],
				})
			);
			slide = ' ';
		}
	}

	if (mode === 'fit') {
		while (fitProcessing) {
			verseLoop: for (let i = 0; i < verses.length; ++i) {
				let words = verses[i].text.split(' ');
				if (slide[slide.length - 1] === ' ')
					slide = slide.substring(0, slide.length - 1);
				slide += '{' + verses[i].verse + '}';

				for (let j = 0; j < words.length; j++) {
					let update = slide + words[j];
					if (
						getNumLines(
							update,
							currentBoxes[1].fontSize,
							lineHeight,
							currentBoxes[1].width
						) <= maxLines
					)
						slide = update + ' ';
					else {
						currentBoxes[1].fontSize = currentBoxes[1].fontSize - 0.1;
						({ maxLines, lineHeight } = getMaxLines(
							currentBoxes[1].fontSize,
							currentBoxes[1].height
						));
						formattedVerses = [];
						slide = '';
						break verseLoop;
					}
				}
				console.log(currentBoxes);
				formattedVerses.push(
					SlideCreation.newSlide({
						type: 'Verse ' + verses[i].verse,
						boxes: currentBoxes,
						words: [0, slide],
					})
				);
				fitProcessing = false;
			}
		}
	}

	if (mode === 'edit') {
		for (let i = 1; i < slides.length; ++i) {
			currentSlide = slides[i];
			currentBoxes = currentSlide.boxes;
			let words = currentBoxes[1].words.split(' ');
			if (type !== currentSlide.type) {
				slide = slide.replace(/\s+/g, ' ').trim();
				formattedVerses.push(
					SlideCreation.newSlide({
						type: type,
						boxes: currentBoxes,
						words: [0, slide],
					})
				);
				slide = '';
			}
			type = currentSlide.type;
			({ maxLines, lineHeight } = getMaxLines(
				currentBoxes[1].fontSize,
				currentBoxes[1].height
			));

			for (let k = 0; k < words.length; k++) {
				let update = slide + words[k];
				if (
					getNumLines(
						update,
						currentBoxes[1].fontSize,
						lineHeight,
						currentBoxes[1].width
					) <= maxLines
				)
					slide = update + ' ';
				else {
					slide = slide.replace(/\s+/g, ' ').trim();
					console.log(slide);
					formattedVerses.push(
						SlideCreation.newSlide({
							type: type,
							boxes: currentBoxes,
							words: [0, slide],
						})
					);
					slide = words[k] + ' ';
				}
			}
		}
	}

	formattedVerses.push(
		SlideCreation.newSlide({
			type: 'blank',
			boxes: currentBoxes,
			words: [0, ' '],
		})
	);

	return formattedVerses;
}

export function formatAnnouncements(props) {
	let lines = props.text.split('\n');
	let { background, brightness } = props.slide.boxes[0];
	let sections = [];
	let currentSection = [];
	let currentSectionNumber = -1;
	let lineCounter = 0;
	let box = props.slide.boxes[2];
	let { lineHeight, maxLines } = getMaxLines(
		box.fontSize,
		box.height,
		box.topMargin
	);
	console.log(lineHeight, maxLines);
	const filteredLines = [];
	for (let j = 0; j < lines.length; ++j) {
		const cleanLine = lines[j].replace(/[^\w\s'".?;:!&()-]/g, '');
		const trimmed = cleanLine.trim();

		if (trimmed === '' || trimmed === '\n' || trimmed === '\r') {
			continue;
		}

		filteredLines.push(cleanLine);
	}
	for (let i = 0; i < filteredLines.length; ++i) {
		let line = filteredLines[i];

		if (line.replace(/[_\s]+/gm, '').trim() === '') {
			console.log('new section');
			line = filteredLines[i + 1];
			i += 1;
			if (currentSection.length !== 0) sections.push(currentSection);

			currentSection = [];
			currentSection.push({ title: line });
			if (sections[currentSectionNumber]) {
				let slideSpan = Math.ceil(lineCounter / maxLines);
				console.log({ slideSpan, lineCounter, maxLines });
				console.log(Math.ceil(lineCounter / slideSpan));
				sections[currentSectionNumber][0].linesPerSlide = Math.ceil(
					lineCounter / slideSpan
				);
				lineCounter = 0;
			}
			++currentSectionNumber;
		} else {
			let linesNum = getNumLines(
				line,
				box.fontSize,
				lineHeight,
				box.width,
				box.sideMargin
			);
			if (!currentSection.length) {
				currentSection.push({ title: '' });
				++currentSectionNumber;
			}
			currentSection.push({ text: line, lines: linesNum });
			lineCounter += linesNum;
		}
	}
	if (currentSection.length !== 0) sections.push(currentSection);
	if (sections.length === 0) return null;
	
	let slideSpan = Math.ceil(lineCounter / maxLines);
	console.log({ currentSectionNumber, lineCounter, maxLines });
	sections[currentSectionNumber][0].linesPerSlide = Math.ceil(
		lineCounter / slideSpan
	);
	let words;
	let slides = [];
	console.log(sections);

	for (let i = 0; i < sections.length; ++i) {
		let lineCounter = 0;
		let linesPerSlide = sections[i][0].linesPerSlide;
		let title = sections[i][0].title;
		words = '';
		for (let j = 1; j < sections[i].length; ++j) {
			let section = sections[i][j];
			lineCounter += section.lines;
			if (lineCounter <= maxLines) {
				if (section.lines <= 3 && section.text[section.text.length - 1] !== ':') {
					if (section.text.split(' ')[0].length < 21) 
						words += '• ';
					words += section.text + '\n';
				} else words += section.text + '\n';
			} else if (section.lines > maxLines) {
				let sectionMaxLines = Math.ceil(section.lines / Math.ceil(section.lines / maxLines)) + 1;
				let sentences = section.text.match(/[^.!?]+[.!?]+/g);
				if (words !== '') words += '\n';
				for (let k = 0; k < sentences.length; ++k) {
					let update = words + sentences[k];
					let linesNum = getNumLines(
						update,
						box.fontSize,
						lineHeight,
						box.width,
						box.sideMargin
					);
					if (linesNum <= sectionMaxLines) words = update;
					else {
						slides.push(
							SlideCreation.newSlide({
								type: 'Announcement',
								words: [title, words],
								background: background,
								brightness: brightness,
							})
						);
						words = sentences[k];
					}
				}
			} else if (lineCounter >= maxLines) {
				if (words !== '')
					slides.push(
						SlideCreation.newSlide({
							type: 'Announcement',
							words: [title, words],
							background: background,
							brightness: brightness,
						})
					);
				if (section.lines <= 3) words = '• ' + section.text + '\n';
				else words = section.text + '\n';
				lineCounter = section.lines;
			} else if (lineCounter <= maxLines) {
				if (words !== '')
					slides.push(
						SlideCreation.newSlide({
							type: 'Announcement',
							words: [title, words],
							background: background,
							brightness: brightness,
						})
					);
				slides.push(
					SlideCreation.newSlide({
						type: 'Announcement',
						words: [title, section.text],
						background: background,
						brightness: brightness,
					})
				);
				lineCounter = 0;
				words = '';
			}
		}
		if (lineCounter !== 0) {
			slides.push(
				SlideCreation.newSlide({
					type: 'Announcement',
					words: [title, words],
					background: background,
					brightness: brightness,
				})
			);
			lineCounter = 0;
			words = '';
		}
	}
	// console.log(slides);
	return slides;
}

function getMaxLines(fontSize, height, topMarg) {
	fontSize = fontSize + 'vw';
	let windowWidth = window.innerWidth;
	let topMargin = 1 - (topMarg * 2) / 100 || .86;

	if (!height) height = 86;
	else height *= topMargin;
	height /= 100; // % -> decimal
	height = height * windowWidth * 0.239; //Height of Display Editor = 23.9vw

	let singleSpan = document.createElement('singleSpan');
	singleSpan.innerHTML = 'Only Line';
	singleSpan.style.fontSize = fontSize;
	singleSpan.style.fontFamily = 'Verdana';
	singleSpan.style.position = 'fixed';
	document.body.appendChild(singleSpan);
	let lineHeight = singleSpan.offsetHeight;
	document.body.removeChild(singleSpan);

	let maxLines = Math.floor(height / lineHeight);
	console.log(lineHeight, height, windowWidth, maxLines);
	let obj = { maxLines: maxLines, lineHeight: lineHeight };
	return obj;
}

function getNumLines(text, fontSize, lineHeight, width, sideMarg) {
	fontSize = fontSize + 'vw';
	let windowWidth = window.innerWidth;
	let sideMargin = 1 - (sideMarg * 2) / 100 || 0.9;
	if (!width) width = 90;
	else width *= sideMargin;
	width /= 100;
	width = width * windowWidth * 0.425; //Width of Display Editor = 42.5vw

	let textSpan = document.createElement('textSpan');
	textSpan.innerHTML = text;
	textSpan.style.fontSize = fontSize;
	textSpan.style.fontFamily = 'Verdana';
	textSpan.style.whiteSpace = 'pre-wrap';
	textSpan.style.width = width + 'px';
	textSpan.style.position = 'fixed';
	// textSpan.style.zIndex = 10;
	document.body.appendChild(textSpan);
	let textSpanHeight = textSpan.offsetHeight;
	document.body.removeChild(textSpan);

	let lines = Math.floor(textSpanHeight / lineHeight);
	return lines;
}
