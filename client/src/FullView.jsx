import React from 'react';
import ItemSlides from './ItemSlides';
import ItemList from './ItemList';
import DisplayEditor from './DisplayEditor';
import Backgrounds from './Backgrounds';
import AllItems from './AllItems';
import DisplayWindow from './DisplayWindow';

export default class FullView extends React.Component{

  render() {

    let {setItemIndex, setWordIndex, insertItemIntoList, insertWords, addItem, deleteItemFromList,
      updateItem, setItemBackground, handleFileChange, deleteItem, addItemToList, setSlideBackground,
      openUploader, updateCurrent, duplicateItem} = this.props.parent;
    let {wordIndex, itemList, item, backgrounds, itemIndex, allItems, user, db, currentInfo} = this.props.parent.state;
    let {formatSong} = this.props;

    return (
      <div style={{width:'99%', marginLeft:'1vw', position:'absolute'}}>
        <div style={{display:'flex', fontSize:'calc(10px + 1vw)'}}>
          <div style={{width:'14%', overflowX:'hidden'}}>
            <ItemList setItemIndex={setItemIndex} setWordIndex={setWordIndex}
              addItem={addItem} itemList={itemList} db={db} duplicateItem={duplicateItem}
              deleteItemFromList={deleteItemFromList} backgrounds={backgrounds}
              updateItem={updateItem} insertItemIntoList={insertItemIntoList} itemIndex={itemIndex}
              />
          </div>
          <div style={{width:'82.5%', height:"50%"}}>
            <div style={{display:'flex'}}>
              <div style={{width:'42.5vw', height:'23.9vw', marginLeft:'0.7vw'}}>
                <DisplayEditor wordIndex={wordIndex} backgrounds={backgrounds}
                  item={item} updateItem={updateItem} width={'42.5vw'} height={'23.9vw'}/>
              </div>
              <div style={{marginLeft:'1vw', position: 'relative'}}>
                <Backgrounds backgrounds={backgrounds} handleFileChange={handleFileChange} addItem={addItem}
                  setItemBackground={setItemBackground} user={user} updateCurrent={updateCurrent}
                  setSlideBackground={setSlideBackground} item={item} openUploader={openUploader} db={db}
                  />
                <DisplayWindow backgrounds={backgrounds} words={currentInfo.words} style={currentInfo.style}
                  background={currentInfo.background} width={"16vw"} title={"Presentation"}
                  titleSize="1.25vw"
                  />
              </div>
            </div>
            <div style={{display: 'flex', height:'48%', fontSize:'calc(10px + 1vw)'}}>
                <div style={{width:'43vw', marginLeft:'0.5vw'}}>
                  <ItemSlides setWordIndex={setWordIndex} wordIndex={wordIndex}
                    item={item} updateItem={updateItem}
                    backgrounds={backgrounds} insertWords={insertWords} formatSong={formatSong}
                    />
                </div>
                <div style={{width:'40%', marginLeft:'0.5vw'}}>
                  <AllItems allItems={allItems}
                    deleteItem={deleteItem} addItemToList={addItemToList}
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
