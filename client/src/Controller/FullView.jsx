import React from 'react';
import ItemSlides from './ItemSlides';
import ItemList from './ItemList';
import DisplayEditor from './DisplayEditor';
import Backgrounds from './Backgrounds';
import AllItems from './AllItems';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class FullView extends React.Component{

  render() {

    let {setItemIndex, setWordIndex, insertItemIntoList, insertWords, addItem, deleteItemFromList,
          updateItem, setItemBackground, handleFileChange, deleteItem, addItemToList, setSlideBackground,
          openUploader, updateCurrent, duplicateItem, addMedia} = this.props.parent;
    let {wordIndex, itemList, item, backgrounds, itemIndex, allItems, user, db, currentInfo,
          mode} = this.props.parent.state;
    let {formatSong} = this.props;

    return (
      <div style={{position:'absolute', display:'flex', fontSize:'calc(10px + 1vw)'}}>
        <div style={{width:'14vw', overflowX:'hidden'}}>
          <ItemList setItemIndex={setItemIndex} setWordIndex={setWordIndex}
            addItem={addItem} itemList={itemList} db={db} duplicateItem={duplicateItem}
            deleteItemFromList={deleteItemFromList} backgrounds={backgrounds}
            updateItem={updateItem} insertItemIntoList={insertItemIntoList}
            itemIndex={itemIndex} wordIndex={wordIndex} item={item}
            />
        </div>
        <div>
          {mode === 'edit' &&<div style={{width:'42.5vw', height:'23.9vw', marginLeft:'0.7vw'}}>
            <DisplayEditor wordIndex={wordIndex} backgrounds={backgrounds}
              item={item} updateItem={updateItem} width={'42.5vw'} height={'23.9vw'}/>
          </div>}
          <div style={(mode === 'edit') ? {width:'43vw', marginLeft:'0.5vw', height: '40vh'}
          : {width:'43vw', marginLeft:'0.5vw', height: '92.5vh'}}>
            <ItemSlides setWordIndex={setWordIndex} wordIndex={wordIndex}
              item={item} updateItem={updateItem} setSlideBackground={setSlideBackground}
              backgrounds={backgrounds} insertWords={insertWords} formatSong={formatSong}
              />
          </div>
        </div>
        <div style={{marginLeft:'1vw', position: 'relative'}}>
          <Backgrounds backgrounds={backgrounds} handleFileChange={handleFileChange} addMedia={addMedia}
            setItemBackground={setItemBackground} user={user} updateCurrent={updateCurrent}
            setSlideBackground={setSlideBackground} item={item} openUploader={openUploader} db={db}
            />
          <DisplayWindow backgrounds={backgrounds} words={currentInfo.words} style={currentInfo.style}
            background={currentInfo.background} width={"16vw"} title={"Presentation"}
            titleSize="1.25vw"
            />
          <AllItems allItems={allItems} backgrounds={backgrounds}
            deleteItem={deleteItem} addItemToList={addItemToList}
            />
        </div>
      </div>
    )
  }

}
