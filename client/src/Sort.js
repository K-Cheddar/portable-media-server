export function sortNamesInList(list){
  return list.sort(function(a,b){
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB, 'en', { numeric: true })
  });
}

export function sortList(list){
  return list.sort(function(a,b){
    var nameA = a.toUpperCase();
    var nameB = b.toUpperCase();
    return nameA.localeCompare(nameB, 'en', { numeric: true })
  });
}
