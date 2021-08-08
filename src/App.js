import React from "react";
import './App.css';
import {appContext, createStore, connect, Provider} from "./redux";
const reducer = (state, {type, payload}) => {
    if (type === 'UPDATE') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
    }
    return state
}

const initState = {
    user: {name: 'Sunny', age: 18},
    group: {name: 'web'}
}
const store = createStore(reducer, initState)
function App() {
  return (
    <Provider  className="App" store={store}>
      <Item1/>
      <Item2/>
      <Item3/>
    </Provider>
  );
}




const Item1 = () => {
  console.log('Item1-----',Math.random())
  return <section className='item'>子组件1<InputView/></section>
}
const Item2 = () => {
  console.log('Item2-----',Math.random())
  return <section className='item'>子组件2<InputItem/></section>
}
const Item3 = () => {
  console.log('Item3-----',Math.random())
  return <section className='item'>子组件3<Item4/></section>
}
const InputItem =connect(null, (dispatch) => {
    return {
        update: (payloadData) => dispatch({type:'UPDATE',payload:payloadData})
    }
})(({update, state}) => {
    console.log('InputItem----', Math.random())
    const changeValue = (e) => {
        update({name: e.target.value})
    }
    return <div>变动输入框：<input value={state.user.name}
                             onChange={changeValue}/>
    </div>
  })
const InputView = connect(state => {
  return {user: state.user}
})(({user}) => {
    console.log('InputView----', Math.random())
  return <div>变动实时显示用户名：{user.name}</div>
})
const Item4 = connect(state => {
    return {group: state.group}
})(({group}) => {
  console.log('Item4-----',Math.random())
  return  <div>不更新组件内容：  {group.name}</div>
})
export default App;
