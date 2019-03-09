export default function makeUnique(props){
	let {name, property, list, id} = props;
	let element = id ?
		list.find(e => e[property] === name && ((e.id && e.id !== id )|| (e._id && e._id !== id))) 
		: list.find(e => e[property] === name);
	const find = (counter) => {
		return list.find(e => e[property] === name + ` (${counter})`);
	}; 
	if(element){
		let counter = 2;
		while(true){
			if(find(counter))
				++counter;
			else{
				return name + ` (${counter})`;
			}
		}
	}
	else
		return name;
}
