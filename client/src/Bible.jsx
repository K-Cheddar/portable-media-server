import React, { Component } from 'react';
import kjv from './assets/kjv';
import {HotKeys} from 'react-hotkeys';

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
      selectedVerses: []
    }
    this.handlers = {
      'close': this.close
    }

  }
  componentDidMount(){
    let bibleWindow = document.getElementById("bibleWindow");
    bibleWindow.focus();
  }
  close = () => {
    this.props.close()
  }
  updateBook = (e) => {
    this.setState({bookSearch: e.target.value})
  }
  updateChapter = (e) => {
    this.setState({chapterSearch: e.target.value})
  }
  updateStartVerse = (e) =>{
    this.setState({verseStartSearch: e.target.value})
  }
  updateEndVerse = (e) => {
    this.setState({verseEndSearch: e.target.value})
  }
  selectBook = (index) => {
    this.setState({
      currentBook: index,
      currentChapter: 0,
      startVerse: 0,
      endVerse: 0
    })
  }
  selectChapter = (index) => {
    this.setState({
      currentChapter: index,
      startVerse: 0,
      endVerse: 0
    })
  }
  selectStartVerse = (index) => {
    let {endVerse} = this.state;
    this.setState({startVerse: index})
    if(endVerse < index)
      this.setState({endVerse: index})
  }
  selectEndVerse = (index) => {
    this.setState({endVerse: index})
  }

  createVersesItem = () => {
    let {currentBook, currentChapter, startVerse, endVerse} = this.state;
    let verses = kjv.books[currentBook].chapters[currentChapter].verses.filter(
      e => (e.verse >= startVerse+1 && e.verse <= endVerse+1)
    );

    let verseNum = (endVerse !== startVerse) ? (startVerse+1)+ "-" + (endVerse+1) : (startVerse+1)
    let name = kjv.books[currentBook].name + " " + (currentChapter+1) + ":" + verseNum

    let item = {
      "_id": name,
      "name": name,
      "background": "",
      "slides": [
        {
          type: 'Name',
          boxes: [
            {background: '',
             fontSize: 4.5,
             fontColor: 'rgba(255, 255, 255, 1)',
             words: name,
            }
          ]
        }
      ],
      "type": "bible"
    };

    item = this.props.formatBible(item, 'create', verses);
    this.props.addItem(item);
    this.props.close();
  }

  render(){
    let {currentBook, currentChapter, startVerse, endVerse,
      bookSearch, chapterSearch, verseStartSearch, verseEndSearch} = this.state;

    let filteredBooks = [], filteredChapters = [], filteredVersesStart = [], filteredVersesEnd = [];

    let allBooks = kjv.books.map((e, index) => ({index: index, name: e.name}));
    if(bookSearch.length > 0)
      filteredBooks = allBooks.filter(ele => ele.name.toLowerCase().includes(bookSearch.toLowerCase()))
    else
      filteredBooks = allBooks.slice(0);

    let allChapters = kjv.books[currentBook].chapters.map((e, index) => ({index: index, chapter: e.chapter}));
    if(chapterSearch.length > 0)
      filteredChapters = allChapters.filter(ele => ele.chapter.toString().toLowerCase().includes(chapterSearch.toLowerCase()))
    else
      filteredChapters = allChapters.slice(0);

    let allVerses = kjv.books[currentBook].chapters[currentChapter].verses.map((e, index) => ({index: index, verse: e}));
    if(verseStartSearch.length > 0)
      filteredVersesStart = allVerses.filter(ele => ele.verse.verse.toString().toLowerCase().includes(verseStartSearch.toLowerCase()))
    else
      filteredVersesStart = allVerses.slice(0);

    if(verseEndSearch.length > 0)
      filteredVersesEnd = allVerses.filter(ele => ele.verse.verse.toString().toLowerCase().includes(verseEndSearch.toLowerCase()))
    else
      filteredVersesEnd = allVerses.slice(0);

    filteredVersesEnd = filteredVersesEnd.filter(e => e.verse.verse >= startVerse+1);

    let text = allVerses.filter(e => (e.verse.verse >= startVerse+1 && e.verse.verse <= endVerse+1));
    let displayText = text.map((element, index) => {
      return(
        <div style={{padding: '0.5vmax'}} key={index}>{element.verse.verse} {element.verse.text}</div>
      )
    })

    let style = {border:'0.1vmax', borderColor: '#d1d1d1', borderStyle:'solid'};
    let selectedStyle = Object.assign({}, style);
        selectedStyle.borderColor = '#4286f4'

    let books = filteredBooks.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "8vw";
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "8vw";
      let selected = (element.index === currentBook);
      return(
        <div key={index} style={selected ? sStyle : tStyle} onClick={() => (this.selectBook(element.index))}>
          {element.name}
        </div>
      )
    })
    let chapters = filteredChapters.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "4vw";
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "4vw";
      let selected = (element.index === currentChapter);
      return(
        <div key={index} style={selected ? selectedStyle : style} onClick={() => (this.selectChapter(element.index))}>
          {element.chapter}
        </div>
      )
    })
    let versesStart = filteredVersesStart.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "4vw";
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "4vw";
      let selected = (element.index === startVerse);
      return(
        <div key={index} style={selected ? selectedStyle : style} onClick={() => (this.selectStartVerse(element.index))}>
          {element.verse.verse}
        </div>
      )
    })
    let versesEnd = filteredVersesEnd.map((element, index) => {
      let tStyle = Object.assign({}, style);;
      tStyle.width = "4vw";
      let sStyle = Object.assign({}, selectedStyle);;
      sStyle.width = "4vw";
      let selected = (element.index === endVerse);
      return(
        <div key={index} style={selected ? selectedStyle : style} onClick={() => (this.selectEndVerse(element.index))}>
          {element.verse.verse}
        </div>
      )
    })

    let buttonStyle = {
       fontSize: "calc(8px + 0.6vw)", margin:'0.25%', width:'8vw'
    }

    return(
      <HotKeys handlers={this.handlers}>
        <div tabindex="-1" id='bibleWindow' style={{position:'fixed', top:0, left:0, height:'100vh',
          zIndex: 4, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
          <div style={{position:'fixed', zIndex:5, right:'12.5%', top:'1%',
            width:'75vw', height: '65vh', backgroundColor:"#d1d1d1", padding:'1%'}}>
            <div style={{display:'flex'} }>
              <div style={{display: 'flex', width:'50vw', height:'50vh',
                fontSize: "calc(8px + 0.4vmax)", textAlign: 'center'}}>
                <div style={{display: 'block', width:'10vw', margin:'0.5vw'}}>
                  <div >Book</div>
                  <input style={{width:'98%'}} type='text' value={bookSearch} onChange={this.updateBook}/>
                  <div style={{overflowY: 'scroll', height: '90%'}}>{books}</div>
                </div>
                <div style={{display: 'block', width:'5vw', margin:'0.5vw'}}>
                  <div>Chapter</div>
                  <input style={{width:'98%'}} type='text' value={chapterSearch} onChange={this.updateChapter}/>
                  <div style={{overflowY: 'scroll', height: '90%'}}>{chapters}</div>
                </div>
                <div style={{display: 'block', width:'5vw', margin:'0.5vw'}}>
                  <div>Start Verse</div>
                  <input style={{width:'98%'}} type='text' value={verseStartSearch} onChange={this.updateStartVerse}/>
                  <div style={{overflowY: 'scroll', height: '90%'}}>{versesStart}</div>
                </div>
                <div style={{display: 'block', width:'5vw', margin:'0.5vw'}}>
                  <div>End Verse</div>
                  <input style={{width:'98%'}} type='text' value={verseEndSearch} onChange={this.updateEndVerse}/>
                  <div style={{overflowY: 'scroll', height: '90%'}}>{versesEnd}</div>
                </div>
              </div>
              <div>
                {(endVerse !== startVerse) && <div>Selected Verse: {allBooks[currentBook].name} {currentChapter+1}:{startVerse+1}-{endVerse+1}</div>}
                {(endVerse === startVerse) && <div>Selected Verse: {allBooks[currentBook].name} {currentChapter+1}:{startVerse+1}</div>}
                <div style={{overflowY: 'scroll', height: '40vh', width: '40vw'}}>{displayText}</div>
              </div>
            </div>
            <div style={{display:'flex', position:'absolute', right:'0.5vw', bottom:'0.5vh'}}>
              <button style={buttonStyle} onClick={this.props.close}>Close</button>
              <button style={buttonStyle} onClick={this.createVersesItem}>Add Verses</button>
            </div>
          </div>
        </div>
      </HotKeys>
    )


  }

}
