import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import RemotePresentation from './DisplayElements/RemotePresentation';
import LocalPresentation from './DisplayElements/LocalPresentation';
import FullView from './Controller/FullView';
import Login from './Login';
import PouchDB from 'pouchdb';
import DBSetup from './HelperFunctions/DBSetup';
import * as DBUpdater from './HelperFunctions/DBUpdater';
import * as DBGetter from './HelperFunctions/DBGetter';
import * as Overflow from './HelperFunctions/Overflow';
import * as Formatter from './HelperFunctions/Formatter';
import * as SlideUpdate from './HelperFunctions/SlideUpdate';
import * as ItemUpdate from './HelperFunctions/ItemUpdate';
import Home from './Home';
import MobileView from './Mobile/MobileView'
import Toolbar from './ToolbarElements/ToolBar'
import Loading from './Loading'
import cloudinary from 'cloudinary-core';
import {HotKeys} from 'react-hotkeys';
import * as SlideCreation from './HelperFunctions/SlideCreation';
import Peer from 'peerjs'

PouchDB.plugin(require('pouchdb-upsert'));

var cloud = new cloudinary.Cloudinary({cloud_name: "portable-media", api_key:process.env.REACT_APP_CLOUDINARY_KEY, api_secret:process.env.REACT_APP_CLOUDINARY_SECRET, secure: true});

var peer;
var conn;
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
const prevItem = ['up'];
const nextItem = ['down'];
const nextSlide = ['right','space'];
const prevSlide = ['left','shift+space'];

const close = 'esc';
const submit = 'enter';
const nextField = ['tab', 'enter']
const map = {
  // 'nextSlide': 'command+left',
  // 'deleteNode': ['del', 'backspace']
  'nextSlide' : nextSlide,
  'prevSlide' : prevSlide,
  'nextItem': nextItem,
  'prevItem': prevItem,
  'close': close,
  'submit': submit,
  'nextField': nextField,
};

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
  needsUpdate: {},
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
  attempted:{},
  peerID: '',
  isReciever: false,
  isSender: false,
  userSettings: {},
  mode: 'edit',
}

/* App component */
class App extends Component {

  constructor(){
    super();

    this.state = Object.assign({}, initialState);

    this.updateInterval = null;
    this.reconnectPeer = null;
    this.sync = null

  }

  componentDidMount(){

    window.reactLoaded = true;
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
    let that = this;
    setTimeout(function(){
      let success = that.state.retrieved;
      if(!success.finished){
        window.location.reload(true)
      }
    }, 15000)
  }

  addItem = (item) => {
    DBUpdater.addItem({parent: this, item: item})
  }

  addItemToList = (item) => {
    let itemObj = {"name": item.name,"_id": item._id,"background": item.background,
        "nameColor": item.nameColor,"type": item.type};
    //put item in current item list
    DBUpdater.putInList({parent: this, itemObj: itemObj})
    //select created item
    DBGetter.getItem({parent: this, id: item._id})

  }

  addMedia = (background) => {
    let item = {
        "_id": background, "name": "New Image",
        "slides": [SlideCreation.newSlide({type: 'Image', background: background, fontSize: 4.5})],
        "type": "image", "background": background
      }
      DBUpdater.addItem({parent: this, item: item})
  }

  connectToReceiver = () => {
    let {user} = this.state;
    let that = this;
    clearTimeout(this.reconnectPeer)

    peer = new Peer({
       host: window.location.hostname,
       port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80),
       path: '/peerjs'
     });
     peer.on('open', function(id) {
       // console.log("Peer Sender Ready");
       let obj = {user: user};
       fetch('api/getReceiverId', {
          method: 'post',
          body: JSON.stringify(obj),
          headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
       }).then(function(response){
         return response.json();
       }).then(function(res){
         if(res.serverID === undefined){
           return;
         }
         // console.log(res.serverID);
         conn = peer.connect(res.serverID);
         conn.on('open', function(){
             that.setState({isSender: 'connected', isReciever: false})
         })
         conn.on('error', function (error){
           that.setState({isSender: 'disconnected'})
           that.reconnectPeer = setTimeout(function(){
             that.connectToReceiver();
           },5000)
         })
       })
     })


  }

  DBReplicate = (db, remoteDB, localDB) => {
    let that = this;
    let opts = {live: true, retry: true}
    that.setState({db: db, remoteDB: remoteDB})
    remoteDB.replicate.to(localDB).on('complete', function(info){
      DBSetup(db);
      DBGetter.init({parent: that, db: db});
      DBGetter.retrieveImages({parent: that, db: db, cloud: cloud})
      DBGetter.changes({parent: that, db: db, cloud: cloud, remoteDB: remoteDB})
      if(that.state.user !== 'Demo'){
        // console.log('let sync begin!', db, remoteDB);
          that.sync = db.sync(remoteDB, opts)
      }
    })
  }

  deleteItem = (name) => {
    let {allItems, item} = this.state;
    if(name === item.name){
      this.setState({item:{}, wordIndex: 0, itemIndex: -1})
    }
    let index = allItems.findIndex(e => e.name === name)
    DBUpdater.deleteItem({parent: this, name: name, index: index})
  }

  deleteItemFromList = (index) => {
    let {itemIndex} = this.state;
    if(index === itemIndex)
      this.setState({item: {},wordIndex: 0})
    DBUpdater.deleteItemFromList({parent: this, index: index})
  }

  deleteItemList = (id) =>{
    DBUpdater.deleteItemList({db: this.state.db, id: id, selectItemList: this.selectItemList, itemLists: this.state.itemLists})
  }

  duplicateItem = (id) => {
    let that = this;
    this.state.db.get(id).then(function(doc){
      let slides;
      if (doc.type === 'song')
        slides = doc.arrangements[doc.selectedArrangement].slides || null;
      else
        slides = doc.slides || null;
      let itemObj = {"name": doc.name,"_id": doc._id,"background": doc.background,"nameColor": slides[0].boxes[0].fontColor,"type": doc.type};
      that.addItemToList(itemObj)
    })
  }

  duplicateList = (id) => {
    DBUpdater.duplicateList({parent: this, id: id});
  }

  getAttempted = (type) => {
    let {attempted, retrieved, remoteDB, db} = this.state;
    attempted[type] = true;
    if(Object.keys(attempted).length >= 6){
      if(!retrieved.finished){
        if(navigator.onLine){
          let that = this;
          setTimeout(function(){
            if(retrieved.finished)
              return
            let obj = Object.assign({}, initialState);
            that.setState(obj)
            that.setState({retrieved: {}, attempted:{}})
            let localDB = "portable-media"
            that.DBReplicate(db, remoteDB, localDB)
          },10000)

        }
        else if(navigator){
          alert("Please reconnect to the internet to continue")
        }
      }
    }
    this.setState({attempted: attempted})
  }

  getSelectedListId = () => {
    return this.state.selectedItemList.id
  }

  getItemId = () => {
    return this.state.item._id
  }

  getSuccess = (type) => {
    let {retrieved} = this.state;
    retrieved[type] = true;
    //don't begin auto update until all values have been retrieved
    if(Object.keys(retrieved).length >= 6){
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
    let {itemList, itemIndex, needsUpdate} = this.state;
    let item = itemList[itemIndex];
    itemList.splice(itemIndex, 1);
    itemList.splice(targetIndex, 0, item);
    needsUpdate.updateItemList = true;
    this.setState({itemIndex: targetIndex, itemList: itemList, needsUpdate: needsUpdate })
  }

  insertWords = (targetIndex) => {
    ItemUpdate.insertWords({targetIndex: targetIndex, state: this.state, setWordIndex: this.setWordIndex, updateState: this.updateState})
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
    obj.redirect = false;
    this.setState(obj)
    //for some reason these needed to be done separately in the past, perhaps this has changed
    this.setState({retrieved: {}, attempted:{}})
    this.init(database)

  }

  newItemList = (newList) => {
    DBUpdater.newList({db: this.state.db, newList: newList})
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
        DBUpdater.updateImages({db: that.state.db, uploads: uploads});
        setTimeout(function(){
          DBGetter.retrieveImages({parent: that, db: that.state.db, cloud: cloud})
        },1000)
       });

  }

  setItemBackground = (background) => {
    ItemUpdate.setItemBackground({background: background, state: this.state, updateState: this.updateState})
  }

  selectItemList = (name) => {
    let {itemLists} = this.state;
    let id = itemLists.find(e => e.name === name).id;
    this.setState({selectedItemList: {id: id, name: name}})
    DBGetter.selectItemList({db: this.state.db, id: id, updateState: this.updateState})
  }

  setItemIndex = (index) => {
    let {itemList, db} = this.state;
    ItemUpdate.setItemIndex({index: index, updateState: this.updateState})
    if(itemList.length !== 0){
      let itemID = itemList[index] ? itemList[index]._id : 0;
      DBGetter.updateItem({db: db, itemID: itemID, parent: this})
    }
  }

  setAsReceiver = () => {
    let {user} = this.state;
    let that = this;

    peer = new Peer({
       host: window.location.hostname,
       port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80),
       path: '/peerjs'
     });
     peer.on('open', function(id) {
       // console.log('peer is open');
        that.setState({peerID: id, isReciever: 'connected', isSender: false})
        let obj = {user: user, id: id};
        fetch('api/setAsReceiver', {
           method: 'post',
           body: JSON.stringify(obj),
           headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        })
     })
     peer.on('connection', function (serverConn){
       conn = serverConn;
       conn.on('data', function(data){
         that.setState({currentInfo: data.obj})
       })
       conn.on('error', function (error){
          that.setState({isReciever: 'disconnected'})
         setTimeout(function(){
           that.setAsReceiver();
         },3000)
       })
     })


  }

  setSlideBackground = (background) => {
    SlideUpdate.setSlideBackground({background: background, state: this.state, updateState: this.updateState})
  }

  setWordIndex = (index) => {
    SlideUpdate.setWordIndex({index: index, state: this.state, updateState: this.updateState, updateCurrent: this.updateCurrent, conn: conn})
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


  // window.open()
  }

  toggleFreeze = () => {
    this.setState({freeze: !this.state.freeze})
  }

  update = () => {
    let {needsUpdate, db} = this.state;
    if(!db.get)
      return;
    for(let property in needsUpdate){
      if(needsUpdate[property] && needsUpdate.hasOwnProperty(property)){
        let func = DBUpdater[property];
        func(this.state);
        needsUpdate[property] = false;
      }
    }
  }

  updateBoxPosition = (position) => {
    Formatter.updateBoxPosition({state: this.state, position: position, updateItem: this.updateItem})
  }

  updateBrightness = (level) => {
    Formatter.updateBrightness({state: this.state, level: level, updateState: this.updateState})
  }

  updateCurrent = ({words = null,background = null,style = {}, displayDirect=false} = {}) => {

    if(this.state.freeze)
      return;

    let {item, wordIndex, remoteDB} = this.state;
    let slides;
    if (item.type === 'song')
      slides = item.arrangements[item.selectedArrangement].slides || null;
    else
      slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;

    if(slide && !displayDirect){
      if(!words)
        words = slide.boxes[0].words;
      if(!background)
        background = slide.boxes[0].background;
      if(!style)
        style = slide.boxes[0];
    }
    else if(displayDirect){
      if(!words)
        words = ' '
      if(!background)
        background = ' '
      if(!style)
        style = {}
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
    if(conn)
      conn.send({obj})
    this.setState({currentInfo: obj})
    DBUpdater.updateCurrent({db: remoteDB, obj: obj});
    localStorage.setItem('presentation', JSON.stringify(obj));
  }

  updateFontColor = (fontColor) => {
    Formatter.updateFontColor({fontColor: fontColor, state:this.state, updateState: this.updateState})
  }

  updateFontSize = (fontSize) => {
    Formatter.updateFontSize({fontSize: fontSize, state:this.state, updateState: this.updateState})
  }

  updateItem = (item) => {
    console.log(this.state.item.selectedArrangement, item.selectedArrangement);
      ItemUpdate.updateItem({state: this.state, item: item, updateState: this.updateState})
  }

  updateItemStructure = () => {
    DBUpdater.updateItemStructure(this.state.db);
  }

  updateUserSettings = (obj) => {
    let userSetting = {type: obj.type, obj: obj.settings};
    DBUpdater.updateUserSettings({state: this.state, userSetting: userSetting, updateState: this.updateState})
  }

  updateState = (obj) => {

    // this.setState({obj.type: obj.data})

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
      needsUpdate: obj.needsUpdate || this.state.needsUpdate,
      userSettings: obj.userSettings || this.state.userSettings,
    })
  }

  render() {

    let {backgrounds, currentInfo, isLoggedIn, retrieved} = this.state;

    let style = { height:'100vh',   width: '100vw',   overflow: 'hidden',
                  zIndex: 1,        position: 'fixed'
    }

    if(window.location.hash === '#/localpresentation' || window.location.hash === '#/remotepresentation')
      style.backgroundColor = '#000'
    else
      style.backgroundColor = '#383838'

    return (
      <HotKeys keyMap={map}>
        <div id="fullApp" style={style}>
          <Toolbar parent={this} formatBible={Overflow.formatBible}/>
        {!retrieved.finished && <Loading retrieved={retrieved}/>}
          <div>
              {/* Route components are rendered if the path prop matches the current URL */}
              <Switch>
                <Route path="/fullview" render={(props) =>
                  <FullView {...props} parent={this} formatSong={Overflow.formatSong}
                  />}/>
                <Route path="/mobile" render={(props) =>
                  <MobileView {...props} parent={this} formatSong={Overflow.formatSong}
                  />}/>
                <Route path="/login" render={(props) =>
                    <Login {...props} login={this.login}
                    />}/>
                <Route path="/localpresentation" render={(props) =>
                  <LocalPresentation {...props} currentInfo={currentInfo}
                    backgrounds={backgrounds}
                  />}/>
                <Route path="/remotepresentation" render={(props) =>
                  <RemotePresentation {...props} currentInfo={currentInfo}
                    backgrounds={backgrounds} setAsReceiver={this.setAsReceiver}
                  />}/>
                <Route render={(props) =>
                  <Home {...props} isLoggedIn={isLoggedIn} logout={this.logout}
                    setAsReceiver={this.setAsReceiver} connectToReceiver={this.connectToReceiver}
                />}/>
              </Switch>
          </div>
        </div>
      </HotKeys>
    )
  }
}

export default App;
