import React, {Component} from 'react'
import deleteX from './assets/deleteX.png';
import * as Sort from './Sort'

export default class SongSection extends Component{

  render(){

    let {setSectionIndex, item, changeSectionType, sectionTypes, deleteSection, changeSectionText,
          i, index, sectionIndex, sectionsPresent} = this.props;

   sectionsPresent = sectionsPresent.filter(e => e !== item.name)

   Sort.sortList(sectionTypes);
   Sort.sortList(sectionsPresent);

   let allSections = sectionTypes.concat(sectionsPresent);
   allSections = allSections.filter(function(item, pos) {
    return allSections.indexOf(item) === pos;
    })

    return(
      <div style={{width:'33%', display:'flex', marginRight:'0.5vmax'}} key={i}
        onMouseDown={() => (setSectionIndex(index*3+i))}>
        <div>
          <div style={{display:'flex', fontSize:'calc(7.5px + 0.75vmax)', margin:'2%'}}>
            <select value={item.type} onChange={changeSectionType}>
              {allSections.map((element, index) =>
                <option key={index}> {element} </option>
              )}
            </select>
            <div style={{paddingLeft: '1vmax', paddingRight:'1vmax'}}>
              {item.name}
            </div>
          </div>
          <div style={{}} id={"Section"+(index*3+i)}>
            <div  style={((index*3+i) === sectionIndex) ? {border:'0.25vmax',
              borderColor: '#4286f4', borderStyle:'solid', width:"15vw", height:"28vh"}
                : { border:'0.25vmax', borderColor: '#d1d1d1', borderStyle:'solid',
               width:"15vw", height:"28vh"}}
              >
              <textarea style={{fontSize:'calc(7.5px + 0.5vmax)', margin:'1%',
                width:"96%", height:"96%", resize:'none'}} value={item.words}
                 onChange={changeSectionText} id={item.name}/>
            </div>
          </div>
        </div>
        <img style={{display:'block', width:'1.5vmax', height:'1.5vmax'}}
           onClick={() => (deleteSection(index*3+i))}
           alt="delete" src={deleteX}
          />
      </div>
    )
  }
}
