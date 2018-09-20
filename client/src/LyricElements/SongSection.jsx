import React, {Component} from 'react'
import deleteX from '../assets/deleteX.png';
import * as Sort from '../HelperFunctions/Sort'

export default class SongSection extends Component{

  changeSectionType = (e, index) => {
    this.props.changeSectionType(e);
    this.props.setSectionIndex(index);
  }

  render(){

    let {item, sectionTypes, deleteSection, changeSectionText, i, sectionWidth,
       index, sectionIndex, sectionsPresent, setSectionIndex, numSongSections} = this.props;

   sectionsPresent = sectionsPresent.filter(e => e !== item.name)

   Sort.sortList(sectionTypes);
   Sort.sortList(sectionsPresent);

   let allSections = sectionTypes.concat(sectionsPresent);
   allSections = allSections.filter(function(item, pos) {
    return allSections.indexOf(item) === pos;
    })

  let buttonStyle = {fontSize: `calc(56vw*${sectionWidth}/20)`, backgroundColor:'#383838',
     border:'0.15vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', width: '40%'}

  let style ={display:'flex', height: '100%', width: '100%'};

    return(
      <div style={style} key={i}>
        <div style={{width:'95%'}} onClick={() => setSectionIndex(index*numSongSections+i)} >
          <div style={{display:'flex', margin:'2%'}}>
            <select style={buttonStyle} value={item.type}
              onChange={ (e) => this.changeSectionType(e, index*numSongSections+i)}>
              {allSections.map((element, index) =>
                <option key={index}> {element} </option>
              )}
            </select>
            <div style={{fontSize: `calc(56vw*${sectionWidth}/15)`, marginLeft: '0.3vw', marginRight:'0.3vw',
            textAlign: 'center', width: '60%'}}>
              {item.name}
            </div>
          </div>
          <div onMouseDown={() => setSectionIndex(index*numSongSections+i)}
            id={"Section"+(index*numSongSections+i)}
            style={((index*numSongSections+i) === sectionIndex) ?
              {border:'0.25vw #06d1d1 solid', height: '80%'}
              : { border:'0.25vw #d1d1d1 solid', height: '80%'}}
            >
            <textarea style={{fontSize: `calc(56vw*${sectionWidth}/18.5)`, margin:'1%',
              width:"96%", height:"96%", resize:'none'}} value={item.words}
               onChange={changeSectionText} id={item.name}/>
          </div>
        </div>
        <img style={{display:'block', width:'1.5vmax', height:'1.5vmax'}}
           onClick={() => deleteSection(index*numSongSections+i)}
           alt="delete" src={deleteX}
          />
      </div>
    )
  }
}
