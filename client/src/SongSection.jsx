import React, {Component} from 'react'
import deleteX from './assets/deleteX.png';
import * as Sort from './Sort'

export default class SongSection extends Component{

  changeSectionType = (e, index) => {
    this.props.changeSectionType(e);
    this.props.setSectionIndex(index);
  }

  render(){

    let {item, sectionTypes, deleteSection, changeSectionText, i,
       index, sectionIndex, sectionsPresent, setSectionIndex} = this.props;

   sectionsPresent = sectionsPresent.filter(e => e !== item.name)

   Sort.sortList(sectionTypes);
   Sort.sortList(sectionsPresent);

   let allSections = sectionTypes.concat(sectionsPresent);
   allSections = allSections.filter(function(item, pos) {
    return allSections.indexOf(item) === pos;
    })

  let buttonStyle = {fontSize: "calc(8px + 0.4vmax)", marginRight:"1vw", backgroundColor:'#383838',
     border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw'}

    return(
      <div style={{width:'33%', display:'flex', marginRight:'0.5vmax'}} key={i}>
        <div onClick={() => (setSectionIndex(index*3+i))} >
          <div style={{display:'flex', fontSize:'calc(7.5px + 0.75vmax)', margin:'2%'}}>
            <select style={buttonStyle} value={item.type}
              onChange={ (e) => this.changeSectionType(e, index*3+i)}>
              {allSections.map((element, index) =>
                <option key={index}> {element} </option>
              )}
            </select>
            <div style={{paddingLeft: '1vmax', paddingRight:'1vmax'}}>
              {item.name}
            </div>
          </div>
          <div onMouseDown={() => (setSectionIndex(index*3+i))}  id={"Section"+(index*3+i)}>
            <div style={((index*3+i) === sectionIndex) ? {border:'0.25vmax',
              borderColor: '#06d1d1', borderStyle:'solid', width:"15vw", height:"28vh"}
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
