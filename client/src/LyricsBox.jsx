import React, {Component} from 'react';
import deleteX from './assets/deleteX.png';
import SongSection from './SongSection'
import * as Sort from './Sort'

export default class LyricsBox extends Component{

  constructor(){
    super();
    this.state = {
      text: "",
      formattedLyrics: [],
      sectionIndex: -1,
      sectionTypes:[
        "Verse",
        "Chorus",
        "Bridge",
        "Intro",
        "Ending",
        "Pre-Chorus",
        "Reprise",
        "Reading",
        "Interlude",
        "Pre-Bridge"
      ],
      sectionsPresent:[],
      songOrder: [],
      newType: "Verse",
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
      songIndex: 0
    }

    this.checkHeld = null;

  }

  componentDidMount(){
    let {item} = this.props;
    let sectionsPresent = [];
    for (var i = 0; i < item.formattedLyrics.length; i++) {
      sectionsPresent.push(item.formattedLyrics[i].name);
    }
    this.setState({
      formattedLyrics: item.formattedLyrics.slice(),
      songOrder: item.songOrder.slice(),
      sectionsPresent: sectionsPresent,
      newType: item.formattedLyrics[0] ? item.formattedLyrics[0].name : "Verse"
    })
  }

  updateMouse = (e) => {
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  setElement = (index) => {

    this.setState({songIndex: index})

    this.setState({
      mouseDown: true
    })

    this.checkHeld = setTimeout(function() {
      let {mouseDown} = this.state;
      if(mouseDown){
        this.setState({indexBeingDragged: index})
      }

    }.bind(this), 350);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.insertSongIntoOrder(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement = () => {
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  setSectionIndex = (index) => {
    this.setState({sectionIndex: index})
  }

  createSections(lyrics){
    let formattedLyrics = [];
    let lines = lyrics.split("\n\n");
    for(let i = 0; i < lines.length; ++i){
      formattedLyrics.push({
        type: "Verse",
        name: "Verse",
        words: lines[i]
      })
    }

    this.updateSections(formattedLyrics)

  }

  autoFormatLyrics = () => {
    let {songOrder, formattedLyrics} = this.state;
    let {item} = this.props;

    console.log(this.props);
    item.songOrder = songOrder;
    item.formattedLyrics = formattedLyrics;
    item = this.props.formatSong(item);

    console.log("From auto format", item);
    this.props.updateItem(item);
    this.props.close();
  }

  newSection = () => {
    let {formattedLyrics} = this.state;
    formattedLyrics.push({
      type: "Verse",
      name: "Verse",
      words: ""
    })
    this.updateSections(formattedLyrics)
   // this.setState({formattedLyrics: formattedLyrics})
  }

  addSection = () => {
    let {songOrder, newType} = this.state;
    songOrder.push(newType)
    this.setState({songOrder: songOrder})
  }

  updateSections = (formattedLyrics) => {
    let sections = [];
    let {songOrder, sectionsPresent, sectionIndex} = this.state;
    let indexesChanged = [];
    let v = 1;
    let c = 1;
    let b = 1;
    let i = 1;
    let e = 1;
    let name;

    for (let t = 0; t < formattedLyrics.length; ++t){
      switch(formattedLyrics[t].type){
        case "Verse": {
          name = "Verse " + v;
          ++v;
          break;
        }
        case "Chorus": {
          name = "Chorus " + c;
          ++c;
          break;
        }
        case "Bridge": {
          name = "Bridge " + b;
          ++b;
          break;
        }
        case "Intro": {
          name = "Intro " + i;
          ++i;
          break;
        }
        case "Ending": {
          name = "Ending " + e;
          ++e;
          break;
        }
        default:{
          name = formattedLyrics[t].type;
        }
      }
      formattedLyrics[t].name = name;
    }


    for (let t = 0; t < formattedLyrics.length; ++t){
      switch(formattedLyrics[t].type){
        case "Verse": {
          if(v === 2){
            formattedLyrics[t].name = formattedLyrics[t].type
          }
          break;
        }
        case "Chorus": {
          if(c === 2){
            formattedLyrics[t].name = formattedLyrics[t].type
          }
          break;
        }
        case "Bridge": {
          if(b === 2){
            formattedLyrics[t].name = formattedLyrics[t].type
          }
          break;
        }
        case "Intro": {
          if(i === 2){
            formattedLyrics[t].name = formattedLyrics[t].type
          }
          break;
        }
        case "Ending": {
          if(e === 2){
            formattedLyrics[t].name = formattedLyrics[t].type
          }
          break;
        }
        default:{
          name = formattedLyrics[t].name;
        }
      }

      sections.push(formattedLyrics[t].name);
    }

    for (let i = 0; i < sectionsPresent.length; ++i){
      let n = sections[i];
      let p = sectionsPresent[i];
      if(n !== p){
        for(let j = 0; j < songOrder.length; ++j){
          if(songOrder[j] === p){
            if(!indexesChanged.some(e => e === j)){
              songOrder[j] = n;
              indexesChanged.push(j);
            }
          }
        }
      }
    }

    if(songOrder.length === 0){
      songOrder = sections;
    }

    let secName = sections[sectionIndex];

    Sort.sortNamesInList(formattedLyrics)
    Sort.sortList(sections);

    let newIndex = sections.findIndex(e => e === secName)
    console.log(newIndex);

    this.setState({
      formattedLyrics: formattedLyrics,
      sectionsPresent: sections,
      songOrder: songOrder,
      newType: sections[0],
      sectionIndex: newIndex
    })

  }

  deleteSectionFromOrder = (index) => {
    let {songOrder} = this.state;
    songOrder.splice(index, 1);
    this.setState({songOrder: songOrder})
  }

  deleteSection = (index) => {
    let {formattedLyrics, sectionsPresent, songOrder} = this.state;

    for (var i = 0; i < songOrder.length; i++) {
      if(formattedLyrics[index].name === songOrder[i]){
        this.deleteSectionFromOrder(i);
      }
    }

    formattedLyrics.splice(index, 1);
    sectionsPresent.splice(index, 1);
    this.updateSections(formattedLyrics)
    // this.setState({
    //   formattedLyrics: formattedLyrics,
    //   sectionsPresent: sectionsPresent
    // })

  }

  changeSectionText = (e) => {
    let {formattedLyrics, sectionIndex} = this.state;
    formattedLyrics[sectionIndex].words = e.target.value;
    this.setState({formattedLyrics: formattedLyrics});
  }

  changeSectionType = (e) => {
    let {formattedLyrics, sectionIndex} = this.state;
    formattedLyrics[sectionIndex].type = e.target.value;
    this.updateSections(formattedLyrics);
  }

  changeNewType = (e) => {
    this.setState({newType: e.target.value});
  }

  insertSongIntoOrder = (targetIndex) => {
    let {songOrder, songIndex} = this.state;
    let song = songOrder[songIndex];
    songOrder.splice(songIndex, 1);
    songOrder.splice(targetIndex, 0, song);

    this.setState({
      songOrder: songOrder,
      songIndex: targetIndex
    })
  }

  submitText = () => {
    if(this.state.text.length > 0)
      this.createSections(this.state.text);
    this.setState({text: ""})
  }

  textChange = (event) => {
    this.setState({text: event.target.value})
  }

  render(){
    let {formattedLyrics, sectionIndex, sectionTypes, songOrder, newType,
       sectionsPresent, mouseX, mouseY, indexBeingDragged} = this.state;
      let that = this;
    let fullArray = [];
    let row = [];

    for(var i = 0; i < formattedLyrics.length; i+=3){
      for(var j = i; j < i+3; ++j){
        if(formattedLyrics[j])
          row.push(formattedLyrics[j]);
      }

      fullArray.push(row);
      row = [];
    }

    let list = fullArray.map((element, index) => {
      let row = element.map(function (item, i){
        return(
          <div key={index*3+i}>
            <SongSection item={item} setSectionIndex={that.setSectionIndex} changeSectionType={that.changeSectionType}
              sectionTypes={sectionTypes} changeSectionText={that.changeSectionText} deleteSection={that.deleteSection}
              i={i} index={index} sectionIndex={sectionIndex}
              />
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'1vmax'}} key={index}> {row}</div>
      );
    })

    let style;
    let songStyle = {width: "10vw", border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'}
    let songDraggedStyle = {width: "10vw", color:'rgba(50, 0, 0, 0.5)', position:'fixed', left:(mouseX +2) + 'px',
        top: (mouseY + 2) + 'px', border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'};

    let SO = songOrder.map((element, index) => {

      let beingDragged = (indexBeingDragged === index)
      if(beingDragged){
        style = songDraggedStyle;
      }
      if(!beingDragged){
        style = songStyle
      }
      return(
        <div style={{display:'flex', padding:'1vmax', userSelect:'none'}} key={index}>
          <div style={style}
            onMouseDown={() => (this.setElement(index))}
            onMouseOver={() => (this.setTarget(index))}>
            {element}
          </div>
          {beingDragged && <div style={songStyle}></div>}
          <img style={{display:'block', width:'1.5vmax', height:'1.5vmax', paddingLeft:"2%"}}
             onClick={() => (this.deleteSectionFromOrder(index))}
             alt="delete" src={deleteX}
            />
        </div>
      )
    })
    return(
      <div style={{position:'fixed', top:0, left:0, height:'100vh',
        zIndex: 4, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
        <div style={{position:'fixed', zIndex:5, right:'1%', top:'1%',
          width:'95vw', height: '95vh', backgroundColor:"#d1d1d1", padding:'1%'}}>
          <div style={{display:'flex'}}>
              <div>
                <textarea style={{width:'20vw', height:'85vh', whiteSpace:'pre-wrap', resize:'none',}}
                value={this.state.text} onChange={this.textChange}/>
              <button style={{fontSize: "calc(8px + 0.4vmax)", marginLeft: "5vw"}} onClick={this.submitText}>Create Sections</button>
              </div>
              <div >
                <div style={{paddingLeft:'1vmax', overflowY: 'scroll', height: "85vh", width:"56vw"}}>
                  {list}
                </div>
                <button style={{fontSize: "calc(8px + 0.4vmax)", marginLeft: "50vw"}}
                  onClick={this.newSection}>
                  New Section
                </button>
              </div>
              <div >
                <div style={{paddingLeft:'1vmax',overflowY: 'scroll', height: "85vh", width:"17vw"}}>
                  <div style={{fontSize: "calc(10px + 0.5vmax)"}}>Song Order</div>
                  <div style={{fontSize: "calc(8px + 0.4vmax)"}}
                    onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
                    onMouseLeave={this.releaseElement}>{SO}</div>
                </div>
                <div style={{display:'flex'}}>
                  <div style={{paddingLeft: "1vw", width:'5vw'}}>
                    <select value={newType} onChange={this.changeNewType}>
                      {sectionsPresent.map((element, index) =>
                        <option key={index}> {element} </option>
                      )}
                    </select>
                  </div>
                  <button style={{fontSize: "calc(8px + 0.4vmax)", marginLeft: "5vw"}}
                    onClick={this.addSection}>
                    Add Section
                  </button>
                </div>

              </div>

          </div>
          <div style={{position:"absolute", display: 'flex', right:"0", bottom:"0"}}>
              <button style={{fontSize: "calc(8px + 0.4vmax)", margin:"1vw"}}
                onClick={this.props.close}>
                Cancel
              </button>
              <button style={{fontSize: "calc(8px + 0.4vmax)", margin:"1vw"}}
                onClick={this.autoFormatLyrics}>
                Submit Changes
              </button>
          </div>

        </div>
      </div>
    )
  }

}
