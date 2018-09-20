import React, { Component } from 'react';
import kjv from '../assets/kjv';
import {HotKeys} from 'react-hotkeys';
import * as SlideCreation from '../HelperFunctions/SlideCreation';
import playVerse from '../assets/playVerse.png';
import on from '../assets/on.png';
import off from '../assets/off.png';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class Bible extends Component {

  constructor(){
    super()
    this.state = {
      currentBook: 0,
      currentChapter: 0,
      startVerse: 0,
      endVerse: 0,
      bookSearch: '',
      chapterSearch: '',
      verseStartSearch: '',
      verseEndSearch: '',
      selectedVerses: [],
      filteredBooks: [],
      filteredChapters: [],
      filteredVersesStart: [],
      filteredVersesEnd: [],
      allBooks: [],
      allChapters: [],
      allVerses: []
    }
    this.handlers = {
      'nextField': this.nextField,
    }

  }
  componentDidMount(){
    let bibleWindow = document.getElementById("bibleWindow");
    if(bibleWindow)
      bibleWindow.focus();

    this.setState({
      allBooks: kjv.books.map((e, index) => ({index: index, name: e.name})),
      filteredBooks: kjv.books.map((e, index) => ({index: index, name: e.name})),
      allChapters: kjv.books[0].chapters.map((e, index) => ({index: index, chapter: e.chapter})),
      filteredChapters: kjv.books[0].chapters.map((e, index) => ({index: index, chapter: e.chapter})),
      allVerses: kjv.books[0].chapters[0].verses.map((e, index) => ({index: index, verse: e})),
      filteredVersesStart: kjv.books[0].chapters[0].verses.map((e, index) => ({index: index, verse: e})),
      filteredVersesEnd: kjv.books[0].chapters[0].verses.map((e, index) => ({index: index, verse: e})),
    })
  }

  createVersesItem = () => {
    let {currentBook, currentChapter, startVerse, endVerse} = this.state;
    let verses = kjv.books[currentBook].chapters[currentChapter].verses.filter(
      e => (e.verse >= startVerse+1 && e.verse <= endVerse+1)
    );

    let verseNum = (endVerse !== startVerse) ? (startVerse+1)+ "-" + (endVerse+1) : (startVerse+1)
    let name = kjv.books[currentBook].name + " " + (currentChapter+1) + ":" + verseNum
    let defaultBibleBackground = this.props.state.userSettings.defaultBibleBackground;
    let background = defaultBibleBackground ? defaultBibleBackground.name : '';
    let brightness = defaultBibleBackground ? defaultBibleBackground.brightness : 100;
    let item = {
      "_id": name,
      "name": name,
      "slides": [
        SlideCreation.newSlide({type: "Title", fontSize: 4.5, words: name,
          background: background, brightness: brightness}),
        SlideCreation.newSlide({type: "Verse", fontSize: 2.5, words: '',
          background: background, brightness: brightness})
      ],
      "type": "bible",
      "background": background
    };

    item = this.props.formatBible(item, 'create', verses);
    this.props.functions.addItem(item);
    this.props.close();
  }
  displayVerse = (index) => {
    let {currentBook, currentChapter, startVerse} = this.state;
    let verseNum = startVerse + index;
    let verse = [kjv.books[currentBook].chapters[currentChapter].verses[verseNum]]

    let name = kjv.books[currentBook].name + " " + (currentChapter+1) + ":" + verseNum
    let defaultBibleBackground = this.props.state.userSettings.defaultBibleBackground;
    let background = defaultBibleBackground ? defaultBibleBackground.name : '';
    let brightness = defaultBibleBackground ? defaultBibleBackground.brightness : 100;
    let item = {
      "_id": name,
      "name": name,
      "slides": [
        SlideCreation.newSlide({type: "Title", fontSize: 4.5, words: name,
          background: background, brightness: brightness}),
        SlideCreation.newSlide({type: "Verse" + verseNum, fontSize: 2.5, words: '',
          background: background, brightness: brightness})
      ],
      "type": "bible"
    };

    item = this.props.formatBible(item, 'fit', verse);

    let box = item.slides[1].boxes[0];
    let words = box.words;
    this.props.functions.updateCurrent({words: words, style: box, background: box.background, displayDirect: true});
  }

  filterBooks = (bookSearch) => {
    let {allBooks, filteredBooks} = this.state;
    if(bookSearch.length > 0)
      filteredBooks = allBooks.filter(ele => ele.name.toLowerCase().includes(bookSearch.toLowerCase()))
    else
      filteredBooks = allBooks.slice(0);
    let element = filteredBooks[0];
    let index = -1;
    if(element){
      index = allBooks.findIndex(e => e.name === element.name)
      this.selectBook(index);
    }
    this.setState({filteredBooks: filteredBooks})
  }
  filterChapters = (currentBook, chapterSearch) => {
    let allChapters = kjv.books[currentBook].chapters.map((e, index) => ({index: index, chapter: e.chapter}));
    let filteredChapters = [];
    if(chapterSearch.length > 0)
      filteredChapters = allChapters.filter(ele => ele.chapter.toString().toLowerCase().includes(chapterSearch.toLowerCase()))
    else
      filteredChapters = allChapters.slice(0);
    let element = filteredChapters[0];
    let index = -1;
    if(element){
      index = allChapters.findIndex(e => e.chapter === element.chapter)
      this.selectChapter(index);
    }
    this.setState({allChapters: allChapters, filteredChapters: filteredChapters})
  }
  filterVersesStart = (currentBook, currentChapter, verseStartSearch) => {
    let allVerses = kjv.books[currentBook].chapters[currentChapter].verses.map((e, index) => ({index: index, verse: e}));
    let filteredVersesStart = [];
    if(verseStartSearch.length > 0)
      filteredVersesStart = allVerses.filter(ele => ele.verse.verse.toString().toLowerCase().includes(verseStartSearch.toLowerCase()))
    else
      filteredVersesStart = allVerses.slice(0);
    let element = filteredVersesStart[0];
    let index = -1;
    if(element){
      index = allVerses.findIndex(e => e.verse === element.verse)
      this.selectStartVerse(index);
    }
    this.setState({allVerses: allVerses, filteredVersesStart: filteredVersesStart})
  }
  filterVersesEnd = (currentBook, currentChapter, verseEndSearch) => {
    let allVerses = kjv.books[currentBook].chapters[currentChapter].verses.map((e, index) => ({index: index, verse: e}));
    let filteredVersesEnd = [];
    if(verseEndSearch.length > 0)
      filteredVersesEnd = allVerses.filter(ele => ele.verse.verse.toString().toLowerCase().includes(verseEndSearch.toLowerCase()))
    else
      filteredVersesEnd = allVerses.slice(0);
    let element = filteredVersesEnd[0];
    let index = -1;
    if(element){
      index = allVerses.findIndex(e => e.verse === element.verse)
      this.selectEndVerse(index);
    }
    this.setState({filteredVersesEnd: filteredVersesEnd})
  }

  nextField = () => {
    console.log(document.activeElement);
  }

  selectBook = (index) => {
    let {chapterSearch, verseStartSearch, verseEndSearch} = this.state;
    this.filterChapters(index, chapterSearch);
    this.filterVersesStart(index, 0, verseStartSearch);
    this.filterVersesEnd(index, 0, verseEndSearch);
    this.setState({
      currentBook: index,
      currentChapter: 0,
      startVerse: 0,
      endVerse: 0
    })
  }
  selectChapter = (index) => {
    let {currentBook, verseStartSearch, verseEndSearch} = this.state;
    this.filterVersesStart(currentBook, index, verseStartSearch);
    this.filterVersesEnd(currentBook, index, verseEndSearch);
    this.setState({
      currentChapter: index,
      startVerse: 0,
      endVerse: 0
    })
  }
  selectStartVerse = (index) => {
    let {endVerse, allVerses} = this.state;
    let filteredVersesEnd = allVerses.filter(e => e.verse.verse >= index+1);
    this.setState({startVerse: index, filteredVersesEnd: filteredVersesEnd})
    if(endVerse < index)
      this.setState({endVerse: index})
  }
  selectEndVerse = (index) => {
    this.setState({endVerse: index})
  }

  updateBook = (e) => {
    let bookSearch = e.target.value;
    this.filterBooks(bookSearch);
    this.setState({bookSearch: bookSearch})
  }
  updateChapter = (e) => {
    let chapterSearch = e.target.value;
    let {currentBook} = this.state;
    this.filterChapters(currentBook, chapterSearch)
    this.setState({chapterSearch: chapterSearch})
  }
  updateStartVerse = (e) =>{
    let verseStartSearch = e.target.value;
    let {currentBook, currentChapter} = this.state;
    this.filterVersesStart(currentBook, currentChapter, verseStartSearch);
    this.setState({verseStartSearch: verseStartSearch})
  }
  updateEndVerse = (e) => {
    let verseEndSearch = e.target.value;
    let {currentBook, currentChapter} = this.state;
    this.filterVersesEnd(currentBook, currentChapter, verseEndSearch);
    this.setState({verseEndSearch: verseEndSearch})
  }

  render(){
    let {currentBook, currentChapter, startVerse, endVerse,
      bookSearch, chapterSearch, verseStartSearch, verseEndSearch,
      filteredBooks, filteredChapters, filteredVersesStart, filteredVersesEnd,
      allVerses, allBooks} = this.state;

    let {freeze, backgrounds, currentInfo} = this.props.state;
    let {toggleFreeze} = this.props.functions;

    if(!allBooks[0])
      return null;


    let text = allVerses.filter(e => (e.verse.verse >= startVerse+1 && e.verse.verse <= endVerse+1));
    let displayText = text.map((element, index) => {
      return(
        <div style={{margin: '0.5vmax', display: 'flex'}} key={index}>
          <img className='imgButton' style={{display:'block', width:'1.5vw', height:'1.5vw'}}
             onClick={ () => this.displayVerse(index)} alt="playVerse" src={playVerse}
            />
          <div>{element.verse.verse} {element.verse.text}</div>
        </div>
      )
    })

    let style = {border:'0.1vmax', borderColor: '#383838', borderStyle:'solid'};
    let selectedStyle = Object.assign({}, style);
        selectedStyle.borderColor = '#06d1d1'

    let books = filteredBooks.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "7.5vw";
      tStyle.marginLeft = '0.5vw';
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "7.5vw";
      sStyle.marginLeft = '0.5vw';
      let selected = (element.index === currentBook);
      return(
        <div key={index} style={selected ? sStyle : tStyle} onClick={() => this.selectBook(element.index)}>
          {element.name}
        </div>
      )
    })
    let chapters = filteredChapters.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "3vw";
      tStyle.marginLeft = '0.25vw';
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "3vw";
      sStyle.marginLeft = '0.25vw';
      let selected = (element.index === currentChapter);
      return(
        <div key={index} style={selected ? sStyle : tStyle} onClick={() => this.selectChapter(element.index)}>
          {element.chapter}
        </div>
      )
    })
    let versesStart = filteredVersesStart.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "3vw";
      tStyle.marginLeft = '0.25vw';
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "3vw";
      sStyle.marginLeft = '0.25vw';
      let selected = (element.index === startVerse);
      return(
        <div key={index} style={selected ? sStyle : tStyle} onClick={() => this.selectStartVerse(element.index)}>
          {element.verse.verse}
        </div>
      )
    })
    let versesEnd = filteredVersesEnd.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "3vw";
      tStyle.marginLeft = '0.25vw';
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "3vw";
      sStyle.marginLeft = '0.25vw';
      let selected = (element.index === endVerse);
      return(
        <div key={index} style={selected ? sStyle : tStyle} onClick={() => this.selectEndVerse(element.index)}>
          {element.verse.verse}
        </div>
      )
    })

    let buttonStyle = {
       fontSize: "calc(8px + 0.6vw)", margin:'0.25%', width:'8vw', backgroundColor:'#383838',
          border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white',
    }

    let freezeButton = {
      fontSize: "calc(5px + 0.35vw)", marginRight:'.25vw', width:'6vw',backgroundColor:'#383838',
         border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white',
    }

    return(
      <HotKeys handlers={this.handlers} tabIndex="-1" id='bibleWindow'>
          <div style={{position:'relative', width:'75vw', height: '75vh', backgroundColor:"#383838",
            margin: '2vh auto', color: 'white'}}>
            <div style={{display:'flex'}}>
              <div style={{display: 'flex', width:'50vw', height:'70vh',
                fontSize: "calc(8px + 0.4vmax)", textAlign: 'center'}}>
                <div style={{display: 'block', width:'9vw', margin:'0.5vw'}}>
                  <div >Book</div>
                  <input id='bible-book-search' style={{width:'90%'}} type='text' value={bookSearch} onChange={this.updateBook}/>
                  <div style={{overflowX: 'hidden', height: '90%', width: '100%'}}>{books}</div>
                </div>
                <div style={{display: 'block', width:'4vw', margin:'0.5vw'}}>
                  <div>Chapter</div>
                  <input id='bible-chapter-search' style={{width:'80%', margin:'auto'}} type='text' value={chapterSearch} onChange={this.updateChapter}/>
                  <div style={{overflowX: 'hidden', height: '90%', width: '100%'}}>{chapters}</div>
                </div>
                <div style={{display: 'block', width:'4vw', margin:'0.5vw'}}>
                  <div>Start</div>
                  <input id='bible-verse-start-search' style={{width:'80%', margin:'auto'}} type='text' value={verseStartSearch} onChange={this.updateStartVerse}/>
                  <div style={{overflowX: 'hidden', height: '90%', width: '100%'}}>{versesStart}</div>
                </div>
                <div style={{display: 'block', width:'4vw', margin:'0.5vw'}}>
                  <div>End</div>
                  <input id='bible-verse-end-search' style={{width:'80%', margin:'auto'}} type='text' value={verseEndSearch} onChange={this.updateEndVerse}/>
                  <div style={{overflowX: 'hidden', height: '90%', width: '100%'}}>{versesEnd}</div>
                </div>
              </div>
              <div>
                <div style={{display: 'flex'}}>
                  <div style={{color: 'yellow'}}>
                    {(endVerse !== startVerse) && <div style={{display: 'flex'}}>
                      <div style={{fontWeight: 'bold', marginRight: '0.5vw'}}>Selected Verses: </div>
                      <div>{allBooks[currentBook].name} {currentChapter+1}:{startVerse+1}-{endVerse+1}</div>
                    </div>}
                    {(endVerse === startVerse) && <div style={{display: 'flex'}}>
                      <div style={{fontWeight: 'bold', marginRight: '0.5vw'}}>Selected Verse: </div>
                      <div>{allBooks[currentBook].name} {currentChapter+1}:{startVerse+1}</div>
                    </div>}
                  </div>
                  <div style={{position: 'absolute', right: '0.5vw', width: '9.5vw'}}>
                    {freeze && <div style={{display:'flex'}}>
                     <div>
                       <button style={freezeButton} onClick={toggleFreeze}>Unfreeze</button>
                     </div>
                      <img style={{width:'2.75vw', height:'1.25vw'}}
                         alt="off" src={off}
                        />
                      </div>
                    }
                    {!freeze && <div style={{display:'flex'}}>
                    <div>
                      <button style={freezeButton} onClick={toggleFreeze}>Freeze</button>
                    </div>
                      <img style={{width:'2.75vw', height:'1.25vw'}}
                         alt="on" src={on}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div style={{overflowX: 'hidden', height: '40vh', width: '40vw', backgroundColor:'#5b5b5b',
                   top: '1vh', position: 'relative'}}>{displayText}</div>
                <div style={{position: 'relative', top: '2vh'}}>
                  <DisplayWindow backgrounds={backgrounds} words={currentInfo.words} style={currentInfo.style}
                    background={currentInfo.background} width={"16vw"} title={"Presentation"}
                    titleSize="1.25vw"
                    />
                </div>
              </div>
            </div>
            <div style={{display:'flex', position:'absolute', right:'0.5vw', bottom:'0.5vh'}}>
              <button style={buttonStyle} onClick={this.createVersesItem}>Add Verses</button>
            </div>
          </div>
      </HotKeys>
    )


  }

}
