import React, {Component} from 'react'
import deleteX from '../assets/deleteX.png';
import * as Sort from '../Sort'

export default class MobileSongSection extends Component{

  render(){

    let {item, sectionTypes, deleteSection, changeSectionText, i,
       index, sectionsPresent, changeSectionType} = this.props;

   sectionsPresent = sectionsPresent.filter(e => e !== item.name)

   Sort.sortList(sectionTypes);
   Sort.sortList(sectionsPresent);

   let allSections = sectionTypes.concat(sectionsPresent);
   allSections = allSections.filter(function(item, pos) {
    return allSections.indexOf(item) === pos;
    })

    let sectionStyle = { border:'0.25vmax', borderColor: '#d1d1d1', borderStyle:'solid',
   width:"80%", height:"28vh", fontSize:'calc(8px + 0.5vmax)', resize: 'none', marginLeft: '5vw'}

    return(
      <div style={{width:'80%', margin:'auto', display:'flex'}} key={i}>
        <div style={{width: '100%'}}>
          <div style={{display:'flex', fontSize:'calc(9px + 0.75vmax)', margin: '2vh 3vw'}}>
            <div style={{margin: '1vh 2vw', width: '50%'}}>{item.name}</div>
            <select value={item.type} style={{width: '80%', marginLeft: '2vw'}}
              onChange={ (e) => changeSectionType(e)}>
              {allSections.map((element, index) =>
                <option key={index}> {element} </option>
              )}
            </select>
            <img style={{ width:'7vw', height:'7vw', marginLeft: '2vw'}}
               onClick={() => (deleteSection(index))}
               alt="delete" src={deleteX}
              />
          </div>
          <div>
            <textarea style={sectionStyle} value={item.words}
               onChange={changeSectionText} id={item.name}/>
          </div>
        </div>
      </div>
    )
  }
}
