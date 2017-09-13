export default function(state={},action){
  if(action.type==='GET_FRIENDS'){
    console.log('action received!',action);
    return Object.assign({},state,{
      friends: action.friends
    })
  }
  return state
}
