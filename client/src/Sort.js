export function sortNamesInList(list){
  return list.sort(function(a,b){
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();

    if(nameA < nameB)
     return -1;
    if(nameA > nameB)
     return 1;
    return 0;
  });
}

export function sortList(list){
  return list.sort(function(a,b){
    var nameA = a.toUpperCase();
    var nameB = b.toUpperCase();

    if(nameA < nameB)
     return -1;
    if(nameA > nameB)
     return 1;
    return 0;
  });
}
