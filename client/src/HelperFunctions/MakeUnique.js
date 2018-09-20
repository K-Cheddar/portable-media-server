export default function makeUnique(props){
  let {name, property, list} = props;
  if(list.find(e => e[property] === name)){
    let counter = 2;
    while(true){
      if(list.find(e => e[property] === name + ` (${counter})`))
        ++counter;
      else{
        return name + ` (${counter})`
      }
    }
  }
  else
    return name;
}
