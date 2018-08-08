import React, {Component} from 'react';
import MobileSlides from './MobileSlides';
import MobileItemList from './MobileItemList';
import MobileDisplay from './MobileDisplay';
import MobileListChanger from './MobileListChanger';
import on from '../assets/on.png';
import off from '../assets/off.png';


export default class MobileView extends Component{

  constructor(){
    super();
    this.state = {
      itemSelectOpen: false,
    }
  }

  openItemSelect = () => {
    this.setState({itemSelectOpen: true})
  }
  closeItemSelect = () => {
    this.setState({itemSelectOpen: false})
  }

  render() {

    let {wordIndex, setItemIndex, setWordIndex, isLoggedIn, swapItemInList, swapWords,
      addItem, itemList, deleteItemFromList, item, updateItem, backgrounds, itemIndex,
      toggleFreeze, freeze } = this.props;

    let buttonLoggedIn = {margin:'0.5%', width:'60%', minWidth:'18vw'}

    return (
      <div style={{width:'100%', overflow:'hidden', height:'100vh', backgroundColor:'#d9e3f4',
        position: 'fixed'}}>
        <div style={{width:'100%', height:'5vh', paddingTop:'0.5vh', paddingBottom:'0.5vh',
          backgroundColor:'#1d517f', display:'flex'}}>
          <button style={{margin:'auto', width:'22.5%', height:'4.5vh', fontSize:'calc(8px + 0.75vmax)'}}
            onClick={() => (this.props.history.push("/"))}
            >Home</button>
          <button style={{margin:'auto', width:'22.5%', height:'4.5vh', fontSize:'calc(8px + 0.75vmax)'}}
            onClick={this.openItemSelect}
            >Change Item</button>
          {freeze && <div style={{display:'flex', margin:'auto', width:'30%', height:'4.5vh',
             fontSize:'calc(8px + 0.75vmax)'}}>
              <button style={buttonLoggedIn} onClick={toggleFreeze}>Unfreeze</button>
              <img style={{paddingLeft:'5%', paddingTop:'1%', width:'40%', height:'5.5vw',
                maxHeight:'4.5vh', maxWidth:'8vh'}}
                 alt="off" src={off}
                />
              </div>
            }
            {!freeze && <div style={{display:'flex', margin:'auto', width:'30%', height:'4.5vh',
               fontSize:'calc(8px + 0.75vmax)'}}>
            <button style={buttonLoggedIn} onClick={toggleFreeze}>Freeze</button>
              <img style={{paddingLeft:'5%', paddingTop:'1%', width:'40%', height:'5.5vw',
              maxHeight:'4.5vh', maxWidth:'8vh'}}
                 alt="on" src={on}
                />
              </div>
            }
        </div>
        <div style={{display:'block', fontSize:'calc(10px + 1vmax)'}}>
          <div style={{width:'100vw', height: '56.25vw'}}>
            <MobileDisplay wordIndex={wordIndex} backgrounds={backgrounds}
              isLoggedIn={isLoggedIn} item={item} updateItem={updateItem}/>
          </div>
          <div style={{paddingTop:'1.5%', maxWidth:'100%'}}>
            <MobileSlides setWordIndex={setWordIndex} wordIndex={wordIndex}
              isLoggedIn={isLoggedIn} item={item} updateItem={updateItem}
              backgrounds={backgrounds} swapWords={swapWords}
              />
          </div>
        </div>
        {this.state.itemSelectOpen &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh',
             zIndex: 2, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
            <div style={{position:'fixed', display:'flex', top:'2vmax', left:'13vw',
               zIndex: 3, backgroundColor:'#d9e3f4', width:'70vw', maxWidth:'100%'}}>
             <MobileListChanger selectedItemList={this.props.selectedItemList}
               selectItemList={this.props.selectItemList} itemLists={this.props.itemLists}/>

              <MobileItemList setItemIndex={setItemIndex} setWordIndex={setWordIndex}
                isLoggedIn={isLoggedIn} addItem={addItem} itemList={itemList}
                deleteItemFromList={deleteItemFromList} backgrounds={backgrounds}
                updateItem={updateItem} swapItemInList={swapItemInList}
                itemIndex={itemIndex} close={this.closeItemSelect}
                />
            </div>
        </div>}
      </div>
    )
  }

}
