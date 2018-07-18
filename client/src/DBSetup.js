
export default function DBSetup(db){


  let SLcount = 5;
  for (var i = 1; i <= SLcount; ++i){
    SLists(i);
  }

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
    var SL = {
    "_id": "ItemLists",
    "itemLists" : [
      "Item List 1",
      "Item List 2",
      "Item List 3",
      "Item List 4",
      "Item List 5"
    ]
    };
     db.put(SL)
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
    })

  db.get("images").catch(function(doc){
      let upload = {
        _id: "images",
        backgrounds: []
      }
      db.put(upload);
    })

}
