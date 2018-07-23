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
import * as Formatter from './Formatter';
import Home from './Home';
import MobileView from './Mobile/MobileView'
import NavBar from './NavBar'
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
  wordIndex: 0,
  itemIndex: 0,
  item: {},
  itemList: [],
  itemLists: [],
  backgrounds: [],
  selectedItemList: "",
  needsUpdate: false,
  currentInfo : {
    words:"",
    background:"",
    style:{
      color:'',
      fontSize:''
    },
    time: -1,
  },
  allItems:[],
  freeze: true,
  db: {},
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

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setWordIndex = this.setWordIndex.bind(this);
    this.setItemIndex = this.setItemIndex.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addItemToList = this.addItemToList.bind(this);
    this.deleteItemFromList = this.deleteItemFromList.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.update = this.update.bind(this);
    this.updateCurrent = this.updateCurrent.bind(this);
    this.updateFormat = this.updateFormat.bind(this);
    this.setItemBackground = this.setItemBackground.bind(this);
    this.selectItemList = this.selectItemList.bind(this);
    this.test = this.test.bind(this);
    this.insertItemIntoList = this.insertItemIntoList.bind(this);
    this.insertWords = this.insertWords.bind(this);
    this.toggleFreeze = this.toggleFreeze.bind(this);
    this.setSlideBackground = this.setSlideBackground.bind(this);
    this.openUploader = this.openUploader.bind(this);
    this.updateState = this.updateState.bind(this);
    this.getSuccess = this.getSuccess.bind(this);
    this.getAttempted = this.getAttempted.bind(this);
    this.getTime = this.getTime.bind(this);
    this.getSelectedList = this.getSelectedList.bind(this)
    this.addItemList = this.addItemList.bind(this)
  }

  updateFormat({
    c = this.state.item.style.color,
    fontSize = this.state.item.style.fontSize,
    nameSize = this.state.item.nameSize
    } = {}){

    let {item, itemList, itemIndex, allItems, wordIndex} = this.state;
    let color;

    //if it recieves a value it is formatted as {r: r, g: g, b: b, a: a}
    //otherwise the saved value is formatted as rgba(r, g, b, a)
    if(typeof c === 'string')
      color = c;
    else
      color = 'rgba('+c.r+' , ' +c.g+' , '+c.b+' , '+c.a+')';

    item.nameSize = nameSize;
    item.style = {
      color: color,
      fontSize: fontSize
    }

    //update color of item in current list
    itemList[itemIndex].nameColor = color;

    //update color of item in full list
    let index = allItems.findIndex(e => e._id === item._id)
    allItems[index].nameColor = color;

    if(item.type === 'bible' && wordIndex !== 0)
      item = Formatter.formatBible(item, 'edit');

    if(item.type === 'song' && wordIndex !== 0)
      item = Formatter.formatSong(item);

    //update state, ready to update
    this.setState({
      item: item,
      itemList: itemList,
      allItems: allItems,
      needsUpdate: true
    });
  }

//don't begin auto update until all values have been retrieved
  getSuccess(type){
    let {retrieved} = this.state;
    retrieved[type] = true;
    if(Object.keys(retrieved).length >= 5){
        retrieved.finished = true;
        this.updateInterval = setInterval(this.update, 1000); //auto save to database every second if update has occurred
    }
    this.setState({retrieved: retrieved})

  }

  getAttempted(type, db){
    let {attempted, retrieved} = this.state;
    attempted[type] = true;
    if(Object.keys(attempted).length >= 5){
        if(!retrieved.finished){
          if(navigator.onLine){
            attempted = {}
            let obj = Object.assign({}, initialState);
            this.setState(obj)
            DBGetter.init(db, this.updateState, this.getSuccess, this.getAttempted);
            DBGetter.retrieveImages(db, this.updateState, cloud, this.getSuccess, this.getAttempted)
            DBGetter.changes(db, this.updateState, this.getTime, this.getSelectedList, cloud, this.getSuccess, this.getAttempted)
          }
          else{
            alert("Please reconnect to the internet to continue")
          }
          // DBUpdater.keepPresentationAlive(db);
        }
    }
    this.setState({attempted: attempted})
  }

  update(){
     let {item, needsUpdate, selectedItemList, allItems, itemList, db} = this.state;
     if(needsUpdate && db.get){
        DBUpdater.update(db, item, selectedItemList, itemList, allItems, this.updateState);
         this.setState({needsUpdate: false});
     }
  }

  updateState(obj){

    this.setState({
      currentInfo: obj.currentInfo || this.state.currentInfo,
      itemList: obj.itemList || this.state.itemList,
      itemLists: obj.itemLists || this.state.itemLists,
      selectedItemList: obj.selectedItemList || this.state.selectedItemList,
      allItems: obj.allItems || this.state.allItems,
      backgrounds: obj.backgrounds || this.state.backgrounds,
      item: obj.item || this.state.item,
      needsUpdate: (obj.needsUpdate === false) ? false : true,
    })
  }

  componentDidMount(){

    fetch('api/hello')
      .then(response => {console.log(response);})
      // .then(responseData => {
      //   console.log(responseData)
      // })
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


    let dbName = process.env.REACT_APP_DATABASE_STRING + "portable-media-" + database
    var db = new PouchDB(dbName);
    this.setState({db: db})
    DBSetup(db);
    DBGetter.init(db, this.updateState, this.getSuccess, this.getAttempted);
    DBGetter.retrieveImages(db, this.updateState, cloud, this.getSuccess, this.getAttempted)
    DBGetter.changes(db, this.updateState, this.getTime, this.getSelectedList, cloud, this.getSuccess, this.getAttempted)

    // DBUpdater.keepPresentationAlive(db);
    // db.sync(localDB, {
    //   live: true,
    //   retry: true
      // })
  }

  getTime(){
    return this.state.currentInfo.time
  }

  getSelectedList(){
    return this.state.selectedItemList
  }

  setItemBackground(background){
    let {item, itemIndex, itemList, allItems} = this.state;
    let index = allItems.findIndex(e => e.name === item.name)

    if(!item.words)
      return;

    //set all slides to match item background
    for (var i = 0; i < item.words.length; i++) {
      item.words[i].background = background;
    }
    console.log(itemList, itemIndex);
    //update Item background in all places
    itemList[itemIndex].background = background;
    allItems[index].background = background;
    item.background = background;
    this.setState({
      item: item,
      needsUpdate: true,
      itemList: itemList,
      allItems: allItems
    })

  }

  setSlideBackground(background){
    let {item, wordIndex} = this.state;
    let ta = this;
    console.log("BEFORE", item);

    item.words[wordIndex].background = background;
    console.log("DURING", item);
    this.setState({
      item: item,
      needsUpdate: true
    })
    setTimeout(function(){console.log("After", ta.state.item);},1000)
  }

  setWordIndex(index, lyrics){

    let scrollTo = index;

    if(index > this.state.wordIndex && index+1 < this.state.item.words.length)
      scrollTo+=1;
    if(index < this.state.wordIndex && index > 0){
      scrollTo-=1;
    }

    var mElement = document.getElementById("MSlide"+scrollTo);
    var element = document.getElementById("Slide"+index);
    if(mElement)
      mElement.scrollIntoView({behavior: "smooth", block: "nearest", inline:'nearest'});
    if(element)
      element.scrollIntoView({behavior: "smooth", block: "nearest", inline:'nearest'});

    this.setState({wordIndex: index});
    let {item} = this.state;
    if(!item.style)
      return;
    let fSize;
    if(index === 0)
      fSize = item.nameSize
    else
      fSize = item.style.fontSize

    let style = {
      color: item.style.color,
      fontSize: fSize,
    }
    if(item.words[index].background)
      this.updateCurrent({words: lyrics, style: style, background:item.words[index].background, index});
    else
      this.updateCurrent({words: lyrics, style: style});
  }

  updateCurrent({
    words = this.state.item.words[this.state.wordIndex].words,
    background = this.state.item.background,
    style = this.state.item.style,
    index = -1,
    } = {}){

    if(this.state.freeze)
      return;

    if(index >= 0)
      background = this.state.item.words[index].background

    let date = new Date();
    let time = date.getTime();

    let obj = {
      words: words,
      background: background,
      style: style,
      time: time
    }

    this.setState({currentInfo: obj})
    DBUpdater.updateCurrent(this.state.db, words, background, style, time-1);
    localStorage.setItem('presentation', JSON.stringify(obj));
  }

  setItemIndex(index){
    let {itemList, freeze} = this.state;

    var mElement = document.getElementById("MItem"+index);
    if(mElement)
      mElement.scrollIntoView({behavior: "smooth", block: "center", inline:'center'});
    this.setState({itemIndex: index, wordIndex: 0})
    if(itemList.length !== 0){
      let itemID = itemList[index] ? itemList[index]._id : 0;
      DBUpdater.updateItem(this.state.db, itemID, this.updateState, freeze, this.updateCurrent)
    }

  }

  sortItemList(list){
    return list.sort(function(a,b){
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();

      if(nameA < nameB)
       return -1;
      if(nameA > nameB)
       return 1;
      return 0;
    });
  }

  updateItem(item){
    let {itemList, itemIndex, allItems, wordIndex} = this.state;
    itemList[itemIndex].name = item.name;

    allItems = this.sortItemList(allItems)

    let index = allItems.findIndex(e => e._id === item._id)
    allItems[index].name = item.name;

    if(item.type === 'song' && wordIndex !== 0){
      item = Formatter.formatSong(item)
    }

    this.setState({
      item: item,
      itemList: itemList,
      allItems: allItems,
      needsUpdate: true
    });
  }

  addItemToList(item){
    let {selectedItemList, itemIndex} = this.state;
    let itemObj = {
      "name": item.name,
      "_id": item._id,
      "background": item.background,
      "nameColor": item.nameColor,
      "type": item.type
    };

    //put item in current item list
    DBUpdater.selectList(this.state.db, itemObj, selectedItemList, itemIndex, this.updateState)
    //select created item
    DBGetter.getItem(this.state.db, item._id, this.updateState, this.setItemIndex, itemIndex)

  }

  addItem(item){
    let {itemIndex} = this.state;

    DBUpdater.addItem(this.state.db, item, itemIndex, this.updateState, this.setItemIndex, this.addItemToList, this.sortItemList)
  }

  deleteItem(name){
    let {allItems, item, selectedItemList, itemIndex} = this.state;

    if(name === item.name){
      let index = (itemIndex !== 0) ? itemIndex-1 : 0;
      this.setItemIndex(index)
      this.setState({item:{}})
    }


    let index = allItems.findIndex(e => e.name === name)
    DBUpdater.deleteItem(this.state.db, name, allItems, index, selectedItemList, this.setItemIndex, this.updateState)
  }

  deleteItemFromList(index){
    let {itemIndex, itemList, selectedItemList} = this.state;

    itemList.splice(index, 1);
    if(index === itemIndex){
      this.setWordIndex(0);
    }
    if(itemIndex === itemList.length){
      this.setItemIndex(0);
    }

    DBUpdater.deleteItemFromList(this.state.db, selectedItemList, itemList, this.updateState)

  }

  selectItemList(name){
    console.log("SIL", name);
    let {itemLists} = this.state;
    let id = itemLists.find(e => e.name === name).id;
    this.setState({selectedItemList: id})
    DBGetter.selectItemList(this.state.db, id, this.updateState)
  }

  insertItemIntoList(targetIndex){
    let {itemList, itemIndex} = this.state;
    let item = itemList[itemIndex]
    itemList.splice(itemIndex, 1);
    itemList.splice(targetIndex, 0, item);

    this.setItemIndex(targetIndex);
    this.setState({itemList: itemList, needsUpdate: true});
  }

  insertWords(targetIndex){
    let {item, wordIndex} = this.state;
    let words = item.words[wordIndex].words;

    item.words.splice(wordIndex, 1);
    item.words.splice(targetIndex, 0, words);

    this.setWordIndex(targetIndex);
    this.setState({item: item, needsUpdate: true});
  }

  addItemList(){
    let {itemLists} = this.state;
    let name = "Item List " + (itemLists.length+1);
    let newList = {id: name, name: name}
    itemLists.push(newList);
    this.setState({itemLists: itemLists})
    DBUpdater.updateItemLists(this.state.db, itemLists, newList);
  }

  openUploader(){
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
          DBGetter.retrieveImages(that.state.db, that.updateState, cloud, that.getAttempted)
        },1000)
       });

  }

  test(){
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
  }


  toggleFreeze(){
    this.setState({freeze: !this.state.freeze})
  }

  login(database, user, upload_preset){

    clearInterval(this.updateInterval);

    localStorage.setItem('loggedIn', true);
    localStorage.setItem('user', user);
    localStorage.setItem('database', database);
    localStorage.setItem('upload_preset', upload_preset);

    let dbName = process.env.REACT_APP_DATABASE_STRING + "portable-media-" + database
    var db = new PouchDB(dbName);

    let obj = Object.assign({}, initialState);
    this.setState(obj)
    this.setState({
      isLoggedIn: true,
      db: db,
      user: user,
      upload_preset: upload_preset
    })

    DBSetup(db);

    DBGetter.init(db, this.updateState, this.getSuccess, this.getAttempted);
    DBGetter.retrieveImages(db, this.updateState, cloud, this.getSuccess, this.getAttempted)
    DBGetter.changes(db, this.updateState, this.getTime, this.getSelectedList, cloud, this.getSuccess, this.getAttempted)

    // DBUpdater.keepPresentationAlive(db);

  }

  logout(){
    clearInterval(this.updateInterval);

    localStorage.setItem('loggedIn', false);
    localStorage.setItem('user', null);
    localStorage.setItem('database', null);
    localStorage.setItem('upload_preset', null);

    let dbName = process.env.REACT_APP_DATABASE_STRING + "portable-media-demo"
    var db = new PouchDB(dbName);
    let obj = Object.assign({}, initialState);
    this.setState(obj)
    this.setState({db:db})
    DBGetter.init(db, this.updateState, this.getSuccess, this.getAttempted);
    DBGetter.retrieveImages(db, this.updateState, cloud, this.getSuccess, this.getAttempted)
    DBGetter.changes(db, this.updateState, this.getTime, this.getSelectedList, cloud, this.getSuccess, this.getAttempted)

    // DBUpdater.keepPresentationAlive(db);
  }

  render() {

    let {wordIndex, itemIndex, currentInfo, isLoggedIn, item, allItems, freeze, user} = this.state;

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
      <div style={style}>
        <NavBar selectedItemList={this.state.selectedItemList} selectItemList={this.selectItemList}
        itemLists={this.state.itemLists} toggleFreeze={this.toggleFreeze} updateFormat={this.updateFormat}
        addItem={this.addItem} isLoggedIn={isLoggedIn} wordIndex={wordIndex} freeze={freeze} item={item}
        backgrounds={this.state.backgrounds} formatBible={Formatter.formatBible} db={this.state.db}
        test={this.test} user={user} retrieved={this.state.retrieved} addItemList={this.addItemList}/>
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
                  setItemBackground = {this.setItemBackground} updateFormat={this.updateFormat}
                  allItems={allItems} deleteItem={this.deleteItem} insertWords={this.insertWords}
                  addItemToList={this.addItemToList} insertItemIntoList={this.insertItemIntoList}
                  currentInfo={currentInfo} formatSong={Formatter.formatSong} user={user}
                  openUploader={this.openUploader} db={this.state.db}
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
