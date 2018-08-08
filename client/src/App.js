import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import Presentation from './Presentation';
import FullView from './FullView';
import Login from './Login';
import PouchDB from 'pouchdb';
import DBSetup from './DBSetup';
import * as DBUpdater from './DBUpdater';
import * as DBGetter from './DBGetter';
import * as Overflow from './Overflow';
import * as Formatter from './Formatter';
import * as SlideUpdate from './SlideUpdate';
import * as ItemUpdate from './ItemUpdate';
import Home from './Home';
import MobileView from './Mobile/MobileView'
import NavBar from './NavBar'
import Loading from './Loading'
import cloudinary from 'cloudinary-core';

PouchDB.plugin(require('pouchdb-upsert'));

var cloud = new cloudinary.Cloudinary({cloud_name: "portable-media", api_key:process.env.REACT_APP_CLOUDINARY_KEY, api_secret:process.env.REACT_APP_CLOUDINARY_SECRET, secure: true});

// let requestedBytes = 1024*1024*10; // 10MB
//  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//
// navigator.webkitPersistentStorage.requestQuota (
//     requestedBytes, function(grantedBytes) {
//         window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs);
//     }, function(e) { console.log('Error', e); }
// );
// let fileSystem = null
// function onInitFs(fs){
//   fileSystem = fs
//   fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
//
//   // Create a FileWriter object for our FileEntry (log.txt).
//   fileEntry.createWriter(function(fileWriter) {
//
//     fileWriter.onwriteend = function(e) {
//       console.log('Write completed.');
//     };
//
//     fileWriter.onerror = function(e) {
//       console.log('Write failed: ' + e.toString());
//     };
//
//     // Create a new Blob and write it to log.txt.
//     var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
//
//     fileWriter.write(blob);
//   });
//
// });
// }

const initialState = {
  isLoggedIn: false,
  wordIndex: -1,
  itemIndex: -1,
  boxIndex: 0,
  item: {},
  itemList: [],
  itemLists: [],
  allItemLists: [],
  backgrounds: [],
  selectedItemList: {},
  needsUpdate: false,
  currentInfo : {
    words:"",
    background:"",
    style:{
      fontColor:'',
      fontSize:''
    },
    time: -1,
  },
  allItems:[],
  freeze: true,
  db: {},
  remoteDB: {},
  user: "Demo",
  upload_preset:"bpqu4ma5",
  retrieved:{},
  attempted:{}
}

/* App component */
class App extends Component {

  constructor(){
    super();

    this.state = Object.assign({}, initialState);

    this.updateInterval = null;
    this.sync = null

  }

  componentDidMount(){

    //grab current info for persistent login
    let database = 'demo'
    localStorage.setItem('presentation', 'null');
    let sLoggedIn = localStorage.getItem('loggedIn');
    let sUser = localStorage.getItem('user');
    let sDatabase = localStorage.getItem('database');
    let sUploadPreset = localStorage.getItem('upload_preset');

    if(sLoggedIn === 'true')
      this.setState({isLoggedIn: true})
    else
      this.setState({isLoggedIn: false})
    if(sUser !== 'null' && sUser !== null)
      this.setState({user: sUser})
    if(sDatabase && sDatabase !== 'null'){
        database = sDatabase
    }
    if(sUploadPreset)
      this.setState({upload_preset: sUploadPreset})

    this.init(database, true)
    // document.addEventListener('keydown', handleKeyDown)
  }

  addItem = (item) => {
    let {itemIndex} = this.state;
    DBUpdater.addItem(this.state.db, item, itemIndex, this.updateState, this.setItemIndex, this.addItemToList)
  }

  addItemToList = (item) => {
    let {selectedItemList, itemIndex} = this.state;
    let itemObj = {"name": item.name,"_id": item._id,"background": item.background,"nameColor": item.nameColor,"type": item.type};
    //put item in current item list
    DBUpdater.putInList(this.state.db, itemObj, selectedItemList, itemIndex, this.updateState)
    //select created item
    DBGetter.getItem(this.state.db, item._id, this.updateState, this.setItemIndex, itemIndex)

  }

  DBReplicate = (db, remoteDB, localDB) => {
    let that = this;
    let opts = {live: true, retry: true}
    that.setState({db: db, remoteDB: remoteDB})
    remoteDB.replicate.to(localDB).on('complete', function(info){
      DBSetup(db);
      DBGetter.init(db, that.updateState, that.getSuccess, that.getAttempted);
      DBGetter.retrieveImages(db, that.updateState, cloud, that.getSuccess, that.getAttempted)
      DBGetter.changes(db, that.updateState, that.getTime, that.getSelectedList, cloud, that.getSuccess, that.getAttempted, remoteDB)
      if(that.state.user !== 'Demo'){
          that.sync = db.sync(remoteDB, opts)
      }
    })
  }

  deleteItem = (name) => {
    let {allItems, item, selectedItemList, itemIndex, allItemLists} = this.state;
    if(name === item.name)
      this.setState({item:{}, wordIndex: 0})
    this.setItemIndex((itemIndex !== 0) ? itemIndex-1 : 0);
    let index = allItems.findIndex(e => e.name === name)
    DBUpdater.deleteItem(this.state.db, name, allItems, allItemLists, index, selectedItemList, this.setItemIndex, this.updateState)
  }

  deleteItemFromList = (index) => {
    let {itemList, selectedItemList, itemIndex} = this.state;
    if(index === itemIndex)
      this.setState({item: {},wordIndex: 0})
    this.setItemIndex((itemIndex !== 0) ? itemIndex-1 : 0);
    itemList.splice(index, 1);
    DBUpdater.deleteItemFromList(this.state.db, selectedItemList, itemList, this.updateState)

  }

  deleteItemList = (id) =>{
    DBUpdater.deleteItemList(this.state.db, id)
  }

  getAttempted = (type) => {
    let {attempted, retrieved, remoteDB, db} = this.state;
    attempted[type] = true;
    if(Object.keys(attempted).length >= 4){
        if(!retrieved.finished){
          if(navigator.onLine){
            let that = this;
            setTimeout(function(){
              let obj = Object.assign({}, initialState);
              this.setState(obj)
              this.setState({retrieved: {}, attempted:{}})
              let localDB = "portable-media"
              that.DBReplicate(db, remoteDB, localDB)
              },6000)

          }
          else{
            alert("Please reconnect to the internet to continue")
          }
        }
    }
    this.setState({attempted: attempted})
  }

  getSelectedList = () => {
    return this.state.selectedItemList
  }

  getSuccess = (type) => {
    let {retrieved} = this.state;
    retrieved[type] = true;
    //don't begin auto update until all values have been retrieved
    if(Object.keys(retrieved).length >= 4){
        retrieved.finished = true;
        this.updateInterval = setInterval(this.update, 1000); //auto save to database every second if update has occurred
    }
    this.setState({retrieved: retrieved})
  }

  getTime = () => {
    return this.state.currentInfo.time
  }

  init = (database, first) => {
    let remoteURL = process.env.REACT_APP_DATABASE_STRING + "portable-media-" + database
    let localDB = "portable-media"
    let db = new PouchDB(localDB);
    let remoteDB = new PouchDB(remoteURL);
    let that = this;
    if(!first){
      db.destroy().then(function(){
        db = new PouchDB(localDB);
        that.DBReplicate(db, remoteDB, localDB)
      })
    }
    else
      this.DBReplicate(db, remoteDB, localDB)
  }

  insertItemIntoList = (targetIndex) => {
    let {itemList, itemIndex} = this.state;
    let item = itemList[itemIndex];
    itemList.splice(itemIndex, 1);
    itemList.splice(targetIndex, 0, item);
    this.setState({itemIndex: targetIndex, itemList: itemList, needsUpdate: true })
  }

  insertWords = (targetIndex) => {
    let {item, wordIndex} = this.state;
    ItemUpdate.insertWords(targetIndex, item, wordIndex, this.setWordIndex, this.updateState)
  }

  login = (database, user, upload_preset) => {
    //stop updating local and syncing to remote
    clearInterval(this.updateInterval);
    if(this.sync)
      this.sync.cancel()

    //set current info for persistent login
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('user', user);
    localStorage.setItem('database', database);
    localStorage.setItem('upload_preset', upload_preset);


    this.setState({isLoggedIn: true, user: user, upload_preset: upload_preset, retrieved: {}, attempted:{}})

    this.init(database)

  }

  logout = () => {
    //stop updating local and syncing to remote
    clearInterval(this.updateInterval);
    if(this.sync)
      this.sync.cancel()

      //reset current info for persistent login
    localStorage.setItem('loggedIn', false);
    localStorage.setItem('user', null);
    localStorage.setItem('database', null);
    localStorage.setItem('upload_preset', null);

    let database = "demo"
    //reset to initial state
    let obj = Object.assign({}, initialState);
    this.setState(obj)
    //for some reason these needed to be done separately in the past, perhaps this has changed
    this.setState({retrieved: {}, attempted:{}})
    this.init(database)

  }

  newItemList = (newList) => {
    DBUpdater.newList(this.state.db, newList)
  }

  openUploader = () => {
    let that = this;
    let {upload_preset} = this.state;
    window.cloudinary.openUploadWidget({ cloud_name: 'portable-media', upload_preset: upload_preset},
      function(error, result) {
        if(!result)
          return
        let uploads = [];
         for (var i = 0; i < result.length; i++) {
           let type = (result[i].format === 'mp4') ? 'video' : 'image'
           let obj = {
             name: result[i].public_id,
             type: type,
             category: 'Uncategorized',
             url : result[i].url
           };
           console.log(result);
           uploads.push(obj);
         }

        DBUpdater.updateImages(that.state.db, uploads);
        setTimeout(function(){
          DBGetter.retrieveImages(that.state.db, that.updateState, cloud, that.getSuccess, that.getAttempted)
        },1000)
       });

  }

  setItemBackground = (background) => {
    let {item, itemIndex, itemList, allItems} = this.state;
    ItemUpdate.setItemBackground(background, item, itemIndex, itemList, allItems, this.updateState)
  }

  selectItemList = (name) => {
    let {itemLists} = this.state;
    let id = itemLists.find(e => e.name === name).id;
    this.setState({selectedItemList: {id: id, name: name}})
    DBGetter.selectItemList(this.state.db, id, this.updateState)
  }

  setItemIndex = (index) => {
    let {itemList, freeze, db} = this.state;
    ItemUpdate.setItemIndex(index, this.updateState)
    if(itemList.length !== 0){
      let itemID = itemList[index] ? itemList[index]._id : 0;
      DBUpdater.updateItem(db, itemID, this.updateState, freeze, this.updateCurrent, this.setWordIndex)
    }
  }

  setSlideBackground = (background) => {
    let {item, wordIndex, allItems, itemList, itemIndex} = this.state;
    SlideUpdate.setSlideBackground(background, item, wordIndex, itemIndex, allItems, itemList, this.updateState)
  }

  setWordIndex = (index) => {
    let {item, wordIndex} = this.state;
    let lyrics = item.slides[index].boxes[0].words;
    SlideUpdate.setWordIndex(index, lyrics, item, wordIndex, this.updateState, this.updateCurrent)
  }

  update = () => {
     let {item, needsUpdate, selectedItemList, allItems, itemList, itemLists, allItemLists, db} = this.state;
     if(needsUpdate && db.get){
        DBUpdater.update(db, item, selectedItemList, itemList, allItems, itemLists, allItemLists, this.updateState);
         this.setState({needsUpdate: false});
     }
  }

  updateCurrent = ({words = null,background = null,style = {},index = -1, displayImage=false} = {}) => {

    if(this.state.freeze)
      return;

    let {item, wordIndex} = this.state;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(slide && !displayImage){
      if(!words)
        words = slide.boxes[0].words;
      if(!background)
        background = slide.boxes[0].background;
      if(!style)
        style = slide.boxes[0];
    }
    else
      words = ""


    let date = new Date();
    let time = date.getTime();
    let obj = {
      words: words,
      background: background,
      style: style,
      time: time
    }

    this.setState({currentInfo: obj})
    DBUpdater.updateCurrent(this.state.remoteDB, words, background, style, time-1);
    localStorage.setItem('presentation', JSON.stringify(obj));
  }

  updateFontColor = (fontColor) => {
      let {item, itemList, itemIndex, allItems, wordIndex, boxIndex} = this.state;
      Formatter.updateFontColor(fontColor, item, itemList, itemIndex, allItems, wordIndex, boxIndex, this.updateState)
  }

  updateFontSize = (fontSize) => {
      let {item, itemList, itemIndex, allItems, wordIndex, boxIndex} = this.state;
      Formatter.updateFontSize(fontSize, item, itemList, itemIndex, allItems, wordIndex, boxIndex, this.updateState)
  }

  updateBrightness = (level) => {
    let {item, wordIndex, boxIndex} = this.state;
    Formatter.updateBrightness(level, item, wordIndex, boxIndex, this.updateState)
  }

  updateItem = (item) => {
      let {itemList, itemIndex, allItems, wordIndex} = this.state;
      ItemUpdate.updateItem(item, itemList, itemIndex, allItems, wordIndex, this.updateState)
    }

  updateState = (obj) => {

    this.setState({
      currentInfo: obj.currentInfo || this.state.currentInfo,
      itemList: obj.itemList || this.state.itemList,
      itemIndex: (obj.itemIndex !== undefined) ? obj.itemIndex : this.state.itemIndex,
      wordIndex: (obj.wordIndex !== undefined) ? obj.wordIndex : this.state.wordIndex,
      itemLists: obj.itemLists || this.state.itemLists,
      allItemLists: obj.allItemLists || this.state.allItemLists,
      selectedItemList: obj.selectedItemList || this.state.selectedItemList,
      allItems: obj.allItems || this.state.allItems,
      backgrounds: obj.backgrounds || this.state.backgrounds,
      item: obj.item || this.state.item,
      needsUpdate: (obj.needsUpdate === false) ? false : true,
    })
  }

  test = () => {
  //   fileSystem.root.getFile('log.txt', {}, function(fileEntry) {
  //
  //   // Get a File object representing the file,
  //   // then use FileReader to read its contents.
  //   fileEntry.file(function(file) {
  //      var reader = new FileReader();
  //
  //      reader.onloadend = function(e) {
  //        // var txtArea = document.createElement('textarea');
  //        // txtArea.value = this.result;
  //        // document.body.appendChild(txtArea);
  //        console.log(this.result);
  //      };
  //
  //      reader.readAsText(file);
  //   });
  //
  // });

  // DBUpdater.updateALL(this.state.db);
  // window.open()


  }

  toggleFreeze = () => {
    this.setState({freeze: !this.state.freeze})
  }

  render() {

    let {wordIndex, itemIndex, currentInfo, isLoggedIn, item, allItems, freeze, user, retrieved} = this.state;
    let style;
    let siteStyle = {
      backgroundColor: '#d9e3f4',
      height:'100vh',
      width: '100vw',
      overflow: 'hidden',
      zIndex: 1,
      position: 'fixed'
    }
    let presentationStyle = {
      backgroundColor: '#000',
      height:'100vh',
      zIndex: 1,
      position: 'fixed'
    }
    let mobileStyle = {
      backgroundColor: '#d9e3f4',
      height:'100vh',
      overflowY: 'hidden',
      zIndex: 1,
      position: 'fixed'
    }
    switch(window.location.hash){
      case '#/presentation':{
        style = presentationStyle;
        break;
      }
      case '#/mobile':{
        style = mobileStyle;
        break;
      }
      default :{
        style = siteStyle;
        break;
      }
    }

    return (
      <div id="fullApp" style={style}>
        <NavBar selectedItemList={this.state.selectedItemList} selectItemList={this.selectItemList}
        itemLists={this.state.itemLists} toggleFreeze={this.toggleFreeze} deleteItemList={this.deleteItemList}
        addItem={this.addItem} isLoggedIn={isLoggedIn} wordIndex={wordIndex} freeze={freeze} item={item}
        backgrounds={this.state.backgrounds} formatBible={Overflow.formatBible} db={this.state.db}
        test={this.test} user={user} newItemList={this.newItemList} logout={this.logout}
        updateState={this.updateState} allItemLists={this.state.allItemLists} updateBrightness={this.updateBrightness}
        updateFontSize={this.updateFontSize} updateFontColor={this.updateFontColor}
        />
      {!retrieved.finished && <Loading/>}
        <div>
            {/* Route components are rendered if the path prop matches the current URL */}
            <Switch>
              <Route exact={true} path="/" render={(props) =>
                <Home {...props} isLoggedIn={isLoggedIn} logout={this.logout}
              />}/>
              <Route  path="/fullview" render={(props) =>
                <FullView {...props}
                  wordIndex={wordIndex} itemIndex={itemIndex} setSlideBackground={this.setSlideBackground}
                  setItemIndex={this.setItemIndex} setWordIndex={this.setWordIndex}
                  isLoggedIn={this.state.isLoggedIn} updateItem={this.updateItem}
                  addItem={this.addItem} itemList={this.state.itemList} item={this.state.item}
                  deleteItemFromList={this.deleteItemFromList} backgrounds={this.state.backgrounds}
                  setItemBackground = {this.setItemBackground}
                  allItems={allItems} deleteItem={this.deleteItem} insertWords={this.insertWords}
                  addItemToList={this.addItemToList} insertItemIntoList={this.insertItemIntoList}
                  currentInfo={currentInfo} formatSong={Overflow.formatSong} user={user}
                  openUploader={this.openUploader} db={this.state.db} updateCurrent={this.updateCurrent}
                />}/>
              <Route  path="/mobile" render={(props) =>
                <MobileView {...props}
                  wordIndex={wordIndex} itemIndex={itemIndex}
                  setItemIndex={this.setItemIndex} setWordIndex={this.setWordIndex}
                  isLoggedIn={this.state.isLoggedIn} updateItem={this.updateItem}
                  itemList={this.state.itemList} item={this.state.item}
                  backgrounds={this.state.backgrounds} allItems={allItems}
                  itemLists={this.state.itemLists} selectedItemList={this.state.selectedItemList}
                  selectItemList={this.selectItemList} toggleFreeze={this.toggleFreeze} freeze={freeze}
                />}/>
              <Route path="/login" render={(props) =>
                  <Login {...props} login={this.login}
                  />}/>
              <Route path="/presentation" render={(props) =>
                  <Presentation {...props}  words={currentInfo.words} style={currentInfo.style}
                    background={currentInfo.background} backgrounds={this.state.backgrounds}
                    time={currentInfo.time}
                  />}/>
            </Switch>
        </div>
      </div>
    )
  }
}

export default App;
