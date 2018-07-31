
export default function DBSetup(db){

var listCount = 5;

  function SLists(i){
    db.get("Item List "+i).catch(function (err) {
      var SL = {
      "_id": "Item List "+i,
      "items" : []
      };
       db.put(SL)
    })
  }

  db.get("allItems").catch(function (err) {
    var SL = {
    "_id": "allItems",
    "items" : []
    };
     db.put(SL)
  })

  db.get("ItemLists").catch(function (err) {
    let SL = {
    "_id": "ItemLists",
    "itemLists" : [
      {id: "Item List 1", name: "Item List 1"},
      {id: "Item List 2", name: "Item List 2"},
      {id: "Item List 3", name: "Item List 3"},
      {id: "Item List 4", name: "Item List 4"},
      {id: "Item List 5", name: "Item List 5"}
    ]
    };
     db.put(SL)
  })

  db.get("allItemLists").then(function(doc){
    listCount = doc.itemLists.length
  }).catch(function (err) {
    let SL = {
    "_id": "allItemLists",
    "itemLists" : [
      {id: "Item List 1", name: "Item List 1"},
      {id: "Item List 2", name: "Item List 2"},
      {id: "Item List 3", name: "Item List 3"},
      {id: "Item List 4", name: "Item List 4"},
      {id: "Item List 5", name: "Item List 5"}
    ]
    };
     db.put(SL)
  }).then(function (){
    for (var i = 1; i <= listCount; ++i){
      SLists(i);
    }
  })

  db.get("currentInfo").catch(function(){
      let upload = {
        _id: "currentInfo",
        info: {
          words:"",
          background:"",
          style:{
            color:'',
            fontSize:''
          },
          updated: false
        }
      }
      db.put(upload);
      window.location.reload(false)
    })

  db.get("images").catch(function(doc){
      let upload = {
        _id: "images",
        backgrounds: []
      }
      db.put(upload);
    })

}
