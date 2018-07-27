import React from 'react';
import ItemSlides from './ItemSlides';
import ItemList from './ItemList';
import DisplayEditor from './DisplayEditor';
import Backgrounds from './Backgrounds';
import AllItems from './AllItems';
import MiniPresentation from './MiniPresentation';

export default class FullView extends React.Component{

  render() {

    let {wordIndex, setItemIndex, setWordIndex, insertItemIntoList, insertWords,
      addItem, itemList, deleteItemFromList, item, updateItem, backgrounds, itemIndex,
      setItemBackground, handleFileChange, allItems, deleteItem, addItemToList, user,
      currentInfo, formatSong, setSlideBackground, openUploader, db, updateCurrent} = this.props;

    return (
      <div style={{width:'99%', marginLeft:'1vw', position:'absolute'}}>
        <div style={{display:'flex', fontSize:'calc(10px + 1vw)'}}>
          <div style={{width:'17.5%', overflowX:'hidden'}}>
            <ItemList setItemIndex={setItemIndex} setWordIndex={setWordIndex}
              addItem={addItem} itemList={itemList} db={db}
              deleteItemFromList={deleteItemFromList} backgrounds={backgrounds}
              updateItem={updateItem} insertItemIntoList={insertItemIntoList} itemIndex={itemIndex}
              />
          </div>
          <div style={{width:'82.5%', height:"57%", maxHeight:"31vw"}}>
            <div style={{display:'flex'}}>
              <div style={{width:'42.5vw', marginLeft:'0.5vw'}}>
                <DisplayEditor wordIndex={wordIndex} backgrounds={backgrounds}
                  item={item} updateItem={updateItem}/>
              </div>
              <div style={{marginLeft:'1vw'}}>
                <Backgrounds backgrounds={backgrounds} handleFileChange={handleFileChange}
                  setItemBackground={setItemBackground} user={user} updateCurrent={updateCurrent}
                  setSlideBackground={setSlideBackground} item={item} openUploader={openUploader}
                  />
                <MiniPresentation backgrounds={backgrounds} words={currentInfo.words} style={currentInfo.style}
                  background={currentInfo.background} time={currentInfo.time}
                  />
              </div>
            </div>
            <div style={{display: 'flex', height:'43%', fontSize:'calc(10px + 1vw)'}}>
                <div style={{width:'56%', marginLeft:'0.5vw'}}>
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
