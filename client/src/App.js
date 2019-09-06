import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import RemotePresentation from "./DisplayElements/RemotePresentation";
import LocalPresentation from "./DisplayElements/LocalPresentation";
import FullView from "./Controller/FullView";
import Login from "./Login";
import PouchDB from "pouchdb";
import DBSetup from "./HelperFunctions/DBSetup";
import * as DBUpdater from "./HelperFunctions/DBUpdater";
import * as DBGetter from "./HelperFunctions/DBGetter";
import * as Overflow from "./HelperFunctions/Overflow";
import * as Formatter from "./HelperFunctions/Formatter";
import * as SlideUpdate from "./HelperFunctions/SlideUpdate";
import * as ItemUpdate from "./HelperFunctions/ItemUpdate";
import Home from "./Home";
import MobileView from "./Mobile/MobileView";
import Toolbar from "./ToolbarElements/ToolBar";
import Loading from "./Loading";
import cloudinary from "cloudinary-core";
import { HotKeys } from "react-hotkeys";
import firebase from 'firebase';
import * as SlideCreation from "./HelperFunctions/SlideCreation";

PouchDB.plugin(require("pouchdb-upsert"));

var cloud = new cloudinary.Cloudinary({
  cloud_name: "portable-media",
  api_key: process.env.REACT_APP_CLOUDINARY_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_SECRET,
  secure: true
});

var conn;

const firebaseConfig = {
  apiKey: "AIzaSyD8JdTmUVvAhQjBYnt59dOUqucnWiRMyMk",
  authDomain: "portable-media.firebaseapp.com",
  databaseURL: "https://portable-media.firebaseio.com",
  projectId: "portable-media",
  storageBucket: "portable-media.appspot.com",
  messagingSenderId: "456418139697",
  appId: "1:456418139697:web:02dabb94557dbf1dc07f10"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
console.log('Data', database)

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
const prevItem = ["up"];
const nextItem = ["down"];
const nextSlide = ["right", "space"];
const prevSlide = ["left", "shift+space"];
const close = "esc";
const submit = "enter";
const nextField = ["tab", "enter"];
const undo = ["ctrl+z"];
const redo = ["ctrl+shift+z", "ctrl+y"];
const map = {
  // 'nextSlide': 'command+left',
  // 'deleteNode': ['del', 'backspace']
  nextSlide: nextSlide,
  prevSlide: prevSlide,
  nextItem: nextItem,
  prevItem: prevItem,
  close: close,
  submit: submit,
  nextField: nextField,
  undo: undo,
  redo: redo
};

const initialState = {
  isLoggedIn: false,
  wordIndex: 0,
  itemIndex: -1,
  boxIndex: 0,
  item: {},
  itemList: [],
  itemLists: [],
  allItemLists: [],
  backgrounds: [],
  selectedItemList: {},
  needsUpdate: {},
  currentInfo: {
    box: {
      words: "",
      background: "",
      fontColor: "rgba(0, 0, 0, 0)",
      fontSize: 2.5
    },
    time: -1
  },
  allItems: [],
  freeze: true,
  db: {},
  remoteDB: {},
  user: "Demo",
  upload_preset: "bpqu4ma5",
  retrieved: {},
  attempted: {},
  userSettings: {},
  mode: "edit",
  undoReady: false,
  redoReady: false
};

let undoHistory = [];
let undoProperties = [
  "item",
  "itemList",
  "itemIndex",
  "allItems",
  "userSettings",
  "selectedItemList"
];
let undoIndex = -1;
let historyUpdating = false;

/* App component */
class App extends Component {
  constructor() {
    super();

    this.state = JSON.parse(JSON.stringify(initialState));

    this.updateInterval = null;
    this.connectorInterval = null;
    this.sync = null;

    this.handlers = {
      undo: this.undo,
      redo: this.redo
    };
  }

  componentDidMount() {
    window.reactLoaded = true;
    //grab current info for persistent login
    let database = "demo";
    localStorage.setItem("presentation", "null");
    let sLoggedIn = localStorage.getItem("loggedIn");
    let sUser = localStorage.getItem("user");
    let sDatabase = localStorage.getItem("database");
    let sUploadPreset = localStorage.getItem("upload_preset");

    if (sLoggedIn === "true") this.setState({ isLoggedIn: true });
    else this.setState({ isLoggedIn: false });
    if (sUser !== "null" && sUser !== null) this.setState({ user: sUser });
    if (sDatabase && sDatabase !== "null") {
      database = sDatabase;
    }
    if (sUploadPreset) this.setState({ upload_preset: sUploadPreset });

    this.init(database, true);
    this.firebaseCurrent()
    let that = this;
    setTimeout(function () {
      let success = that.state.retrieved;

      if (Object.keys(success).length < 6) {
        window.location.reload(true);
      }
    }, 30000);
  }

  firebaseCurrent = () => {
    const reff = database.ref(`users/${this.state.user}`);
    reff.on('value', (snap) => {this.setState({currentInfo: snap.val()})})
  }

  addItem = item => {
    DBUpdater.addItem({ parent: this, item: item });
  };

  addItemToList = item => {
    let itemObj = {
      name: item.name,
      _id: item._id,
      background: item.background,
      nameColor: item.nameColor,
      type: item.type
    };
    //put item in current item list
    DBUpdater.putInList({ parent: this, itemObj: itemObj });
  };

  addMedia = (name, background) => {
    let item = {
      _id: name,
      name: name,
      slides: [
        SlideCreation.newSlide({
          type: "Image",
          background: background,
          fontSize: 4.5
        })
      ],
      type: "image",
      background: background
    };
    DBUpdater.addItem({ parent: this, item: item });
  };

  DBReplicate = (db, remoteDB, localDB) => {
    let that = this;
    let opts = { live: true, retry: true };
    that.setState({ db: db, remoteDB: remoteDB });
    remoteDB.replicate.to(localDB).on("complete", function (info) {
      DBSetup(db);
      DBGetter.init({ parent: that, db: db });
      DBGetter.retrieveImages({ parent: that, db: db, cloud: cloud });
      DBGetter.changes({
        parent: that,
        db: db,
        cloud: cloud,
        remoteDB: remoteDB
      });
      if (that.state.user !== "Demo") {
        that.sync = db.sync(remoteDB, opts);
      }
    });
  };

  deleteItem = name => {
    let { allItems, item } = this.state;
    if (name === item.name) {
      this.setState({ item: {}, wordIndex: 0, itemIndex: -1 });
    }
    let index = allItems.findIndex(e => e.name === name);
    DBUpdater.deleteItem({ parent: this, name: name, index: index });
    this.updateHistory({ type: "clear" });
  };

  deleteItemFromList = index => {
    let { itemIndex } = this.state;
    if (index === itemIndex) this.setState({ item: {}, wordIndex: 0 });
    DBUpdater.deleteItemFromList({ parent: this, index: index });
  };

  deleteItemList = id => {
    DBUpdater.deleteItemList({
      db: this.state.db,
      id: id,
      selectItemList: this.selectItemList,
      itemLists: this.state.itemLists
    });
    this.updateHistory({ type: "clear" });
  };

  duplicateItem = id => {
    let that = this;
    this.state.db.get(id).then(function (doc) {
      let slides;
      if (doc.type === "song")
        slides = doc.arrangements[doc.selectedArrangement].slides || null;
      else slides = doc.slides || null;
      //Change box
      let itemObj = {
        name: doc.name,
        _id: doc._id,
        background: doc.background,
        nameColor: slides[0].boxes[0].fontColor,
        type: doc.type
      };
      that.addItemToList(itemObj);
    });
  };

  duplicateList = id => {
    DBUpdater.duplicateList({ parent: this, id: id });
  };

  getAttempted = type => {
    let { attempted, retrieved, remoteDB, db } = this.state;
    attempted[type] = true;
    if (Object.keys(attempted).length >= 6) {
      if (!retrieved.finished) {
        if (navigator.onLine) {
          let that = this;
          setTimeout(function () {
            if (retrieved.finished) return;
            let obj = JSON.parse(JSON.stringify(initialState));
            that.setState(obj);
            let localDB = "portable-media";
            that.DBReplicate(db, remoteDB, localDB);
          }, 10000);
        } else if (navigator) {
          alert("Please reconnect to the internet to continue");
        }
      }
    }
    this.setState({ attempted: attempted });
  };

  getSelectedListId = () => {
    return this.state.selectedItemList.id;
  };

  getItemId = () => {
    return this.state.item._id;
  };

  getSuccess = type => {
    let { retrieved } = this.state;
    retrieved[type] = true;
    //don't begin auto update until all values have been retrieved
    if (Object.keys(retrieved).length >= 6) {
      retrieved.finished = true;
      this.updateInterval = setInterval(this.update, 250); //auto save to database every second if update has occurred
      let that = this;
      setTimeout(function () {
        that.updateHistory({ type: "init" });
      }, 10);
    }
    this.setState({ retrieved: retrieved });
  };

  getTime = () => {
    return this.state.currentInfo.time;
  };

  historyToState = () => {
    let { needsUpdate } = this.state;
    let newState = undoHistory[undoIndex];
    for (let property in newState) {
      if (property === "item") needsUpdate.updateItem = true;
      if (property === "itemList") needsUpdate.updateItemList = true;
      if (property === "allItems") needsUpdate.updateAllItems = true;
      if (property === "userSettings") needsUpdate.updateUserSettings = true;
      let obj = JSON.parse(JSON.stringify(newState[property]));
      this.setState({ [property]: obj });
    }
    this.setState({ needsUpdate: needsUpdate });
    historyUpdating = false;
    let u = undoIndex > 0;
    let r = undoIndex < undoHistory.length - 1;
    this.setState({ undoReady: u, redoReady: r });
  };

  init = (database, first) => {
    let remoteURL =
      process.env.REACT_APP_DATABASE_STRING + "portable-media-" + database;
    let localDB = "portable-media";
    let db = new PouchDB(localDB);
    let remoteDB = new PouchDB(remoteURL);
    let that = this;
    if (!first) {
      db.destroy().then(function () {
        db = new PouchDB(localDB);
        that.DBReplicate(db, remoteDB, localDB);
      });
    } else this.DBReplicate(db, remoteDB, localDB);
  };

  insertItemIntoList = targetIndex => {
    let { itemList, itemIndex, needsUpdate } = this.state;
    let item = itemList[itemIndex];
    itemList.splice(itemIndex, 1);
    itemList.splice(targetIndex, 0, item);
    needsUpdate.updateItemList = true;
    this.setState({
      itemIndex: targetIndex,
      itemList: itemList,
      needsUpdate: needsUpdate
    });
  };

  insertWords = targetIndex => {
    ItemUpdate.insertWords({ targetIndex: targetIndex, parent: this });
  };

  login = (database, user, upload_preset) => {
    //stop updating local and syncing to remote
    clearInterval(this.updateInterval);
    if (this.sync) this.sync.cancel();

    //set current info for persistent login
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user", user);
    localStorage.setItem("database", database);
    localStorage.setItem("upload_preset", upload_preset);

    let obj = JSON.parse(JSON.stringify(initialState));
    this.setState(obj);
    this.setState({
      isLoggedIn: true,
      user: user,
      upload_preset: upload_preset
    });

    this.init(database);
  };

  logout = () => {
    //stop updating local and syncing to remote
    clearInterval(this.updateInterval);
    if (this.sync) this.sync.cancel();

    //reset current info for persistent login
    localStorage.setItem("loggedIn", false);
    localStorage.setItem("user", null);
    localStorage.setItem("database", null);
    localStorage.setItem("upload_preset", null);

    let database = "demo";
    //reset to initial state
    let obj = JSON.parse(JSON.stringify(initialState));
    this.setState(obj);
    this.init(database);
  };

  newItemList = newList => {
    DBUpdater.newList({
      db: this.state.db,
      newList: newList,
      selectItemList: this.selectItemList
    });
  };

  openUploader = () => {
    let that = this;
    let { upload_preset } = this.state;
    window.cloudinary.openUploadWidget(
      { cloud_name: "portable-media", upload_preset: upload_preset },
      function (error, result) {
        if (!result) return;
        let uploads = [];
        for (var i = 0; i < result.length; i++) {
          let type = result[i].format === "mp4" ? "video" : "image";
          let obj = {
            name: result[i].public_id,
            type: type,
            category: "Uncategorized",
            url: result[i].url
          };
          console.log(result);
          uploads.push(obj);
        }
        DBUpdater.updateImages({ db: that.state.db, uploads: uploads });
        setTimeout(function () {
          DBGetter.retrieveImages({
            parent: that,
            db: that.state.db,
            cloud: cloud
          });
        }, 1000);
      }
    );
  };

  overrideUndoRedo = e => {
    if (
      (e.ctrlKey && e.key === "z") ||
      (e.ctrlKey && e.key === "y") ||
      (e.ctrlKey && e.shiftKey && e.key === "z")
    ) {
      e.preventDefault();
    }
  };

  redo = () => {
    if (undoIndex >= undoHistory.length - 1 || historyUpdating) return;
    ++undoIndex;
    this.updateUndoIndex();
  };

  setBoxIndex = index => {
    this.setState({ boxIndex: index });
  };

  setItemBackground = background => {
    ItemUpdate.setItemBackground({ background: background, parent: this });
  };

  selectItemList = name => {
    let { itemLists } = this.state;
    let id = itemLists.find(e => e.name === name).id;
    let selectedItemList = { id: id, name: name };
    DBGetter.selectItemList({
      selectedItemList: selectedItemList,
      parent: this
    });
  };

  setItemIndex = index => {
    let { itemList } = this.state;
    ItemUpdate.setItemIndex({ index: index, parent: this });
    if (itemList.length !== 0) {
      let id = itemList[index] ? itemList[index]._id : 0;
      DBGetter.getItem({ id: id, parent: this, index: index });
    }
  };

  setSlideBackground = background => {
    SlideUpdate.setSlideBackground({ background: background, parent: this });
  };

  setWordIndex = index => {
    SlideUpdate.setWordIndex({ index: index, parent: this });
  };

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
    // let url = 'https://www.azlyrics.com/'
    // const html = (await (await fetch(url)).text());
    // console.log(html);
    // fetch('api/getLyrics', {
    //    method: 'post',
    //    body: JSON.stringify({name: 'William McDowell'}),
    //    headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //     },
    // }).then((response) => response.json())
    // .then(function(data){
    //   console.log(data);
    // })
    fetch("api/getHymnal", {
      method: "post",
      body: JSON.stringify({ number: "528" }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(function (data) {
        console.log(data);
      });
  };

  toggleFreeze = () => {
    SlideUpdate.clearTimer();
    SlideUpdate.clearCountdown();
    this.setState({ freeze: !this.state.freeze });
  };

  undo = () => {
    if (undoIndex <= 0 || historyUpdating) return;
    --undoIndex;
    this.updateUndoIndex();
  };

  update = () => {
    let { needsUpdate } = this.state;
    for (let property in needsUpdate) {
      if (needsUpdate[property] && needsUpdate.hasOwnProperty(property)) {
        let func = DBUpdater[property];
        func(this.state, this.updateState);
        needsUpdate[property] = false;
      }
    }
  };

  updateBoxPosition = position => {
    Formatter.updateBoxPosition({ position: position, parent: this });
  };

  updateBrightness = level => {
    Formatter.updateBrightness({ level: level, parent: this });
  };

  updateCurrent = props => {
    if (this.state.freeze) return;

    let { slide, image } = props;

    let date = new Date();
    let time = date.getTime();
    let update = { time: time };
    if (image || image === "")
      update.slide = { boxes: [{ words: "", background: image, style: {} }] };
    else update.slide = JSON.parse(JSON.stringify(slide));

    if (props.displayDirect) SlideUpdate.clearTimer();

    if (conn) conn.send(update);
    this.setState({ currentInfo: update });
    // DBUpdater.updateCurrent({ db: this.state.remoteDB, obj: update });
    console.log('update', update, ...update)
    database.ref(`users/${this.state.user}`).set({...update});
    localStorage.setItem("presentation", JSON.stringify(update));
  };

  updateFontColor = fontColor => {
    Formatter.updateFontColor({ fontColor: fontColor, parent: this });
  };

  updateFontSize = fontSize => {
    Formatter.updateFontSize({ fontSize: fontSize, parent: this });
  };

  updateHistory = props => {
    let newState = {};
    if (undoHistory.length > 0)
      undoHistory = undoHistory.slice(0, undoIndex + 1);
    let currentVal;
    let updateNow = false;
    switch (props.type) {
      case "init":
        undoHistory = [];
        updateNow = true;
        undoIndex = -1;
        for (let property in undoProperties) {
          if (!undoProperties.hasOwnProperty(property)) continue;
          let prop = undoProperties[property];
          newState[prop] = JSON.parse(JSON.stringify(this.state[prop]));
        }
        break;
      case "clear":
        newState = undoHistory[0];
        updateNow = true;
        undoHistory = [];
        undoIndex = -1;
        break;
      case "update":
        currentVal = undoHistory[undoIndex];
        for (let property in undoProperties) {
          if (!undoProperties.hasOwnProperty(property)) continue;
          let prop = undoProperties[property];
          if (
            props[prop] &&
            JSON.stringify(currentVal[prop]) !== JSON.stringify(props[prop])
          ) {
            updateNow = true;
            newState[prop] = JSON.parse(JSON.stringify(props[prop]));
          } else {
            newState[prop] = JSON.parse(JSON.stringify(currentVal[prop]));
          }
        }
        break;
      default:
        console.log("Incorrect Parameters");
    }
    if (updateNow) {
      undoHistory.push(newState);
      ++undoIndex;
    }
    let u = undoIndex > 0;
    let r = undoIndex < undoHistory.length - 1;
    this.setState({ undoReady: u, redoReady: r });
  };

  updateItem = item => {
    ItemUpdate.updateItem({ item: item, parent: this });
  };

  updateItemStructure = () => {
    DBUpdater.updateItemStructure(this.state.db);
  };

  updateState = obj => {
    for (let property in obj)
      if (obj.hasOwnProperty(property))
        this.setState({ [property]: obj[property] });
  };

  updateSkipTitle = val => {
    ItemUpdate.updateSkipTitle({ val: val, parent: this });
  };

  updateNextOnFinish = val => {
    ItemUpdate.updateNextOnFinish({ val: val, parent: this });
  };

  updateUndoIndex = () => {
    let { itemLists } = this.state;
    let newState = undoHistory[undoIndex];
    let newId = newState.item._id;
    let newListId = newState.selectedItemList.id;
    historyUpdating = true;
    if (newId && this.state.item._id !== newId) {
      DBGetter.getItem({
        id: newId,
        parent: this,
        history: true,
        newItemIndex: newState.itemIndex
      });
      this.setState({ boxIndex: 0 });
    } else if (newListId && newListId !== this.state.selectedItemList.id) {
      let name = itemLists.find(e => e.id === newListId).name;
      let selectedItemList = { id: newListId, name: name };
      DBGetter.selectItemList({
        selectedItemList: selectedItemList,
        parent: this,
        history: true
      });
    } else this.historyToState();
  };

  updateUserSetting = obj => {
    let userSetting = { type: obj.type, obj: obj.settings };
    DBUpdater.updateUserSetting({ userSetting: userSetting, parent: this });
  };

  render() {
    let { backgrounds, currentInfo, isLoggedIn, retrieved } = this.state;

    let style = {
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      zIndex: 1,
      position: "fixed"
    };

    if (
      window.location.hash === "#/localpresentation" ||
      window.location.hash === "#/remotepresentation"
    )
      style.backgroundColor = "#000";
    else style.backgroundColor = "#383838";

    return (
      <HotKeys handlers={this.handlers} keyMap={map}>
        <div id="fullApp" style={style}>
          <Toolbar parent={this} formatBible={Overflow.formatBible} />
          {!retrieved.finished && <Loading retrieved={retrieved} />}
          <div>
            {/* Route components are rendered if the path prop matches the current URL */}
            <Switch>
              <Route
                path="/fullview"
                render={props => (
                  <FullView
                    {...props}
                    parent={this}
                    formatSong={Overflow.formatSong}
                  />
                )}
              />
              <Route
                path="/mobile"
                render={props => (
                  <MobileView
                    {...props}
                    parent={this}
                    formatSong={Overflow.formatSong}
                  />
                )}
              />
              <Route
                path="/login"
                render={props => <Login {...props} login={this.login} />}
              />
              <Route
                path="/localpresentation"
                render={props => (
                  <LocalPresentation
                    {...props}
                    currentInfo={currentInfo}
                    backgrounds={backgrounds}
                  />
                )}
              />
              <Route
                path="/remotepresentation"
                render={props => (
                  <RemotePresentation
                    {...props}
                    currentInfo={currentInfo}
                    backgrounds={backgrounds}
                    setAsReceiver={this.setAsReceiver}
                  />
                )}
              />
              <Route
                render={props => (
                  <Home
                    {...props}
                    isLoggedIn={isLoggedIn}
                    logout={this.logout}
                    setAsReceiver={this.setAsReceiver}
                    connectToReceiver={this.connectToReceiver}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </HotKeys>
    );
  }
}

export default App;
