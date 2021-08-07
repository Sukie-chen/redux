import React, {useState, useContext} from "react";
import './App.css';
const appContext = React.createContext(null)
function App() {
  const [appState, setAppState]= useState({
    user: {name: 'Sunny', age: 18 }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider  className="App" value={contextValue}>
      <Item1/>
      <Item2/>
      <Item3/>
    </appContext.Provider>
  );
}

const reducer = (state, {type, payload}) => {
  if (type=== 'UPDATE') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }else {}
  return state
}
// connect 将组件与全局状态联系在一起
const connect = (Component) => {
  return (props) => {
    const {appState, setAppState} = useContext(appContext)
    const dispatch = (action) => {
      setAppState(reducer(appState, action))
    }
    return <Component {...props} dispatch={dispatch} state={appState}/>
  }
}

const Item1 = () => <section className='item'>子组件1<InputView/></section>
const Item2 = () => <section className='item'>子组件2<InputItem/></section>
const Item3 = () => <section className='item'>子组件3<Item4/></section>
const InputItem =connect(({dispatch, state}) => {
  const changeValue = (e) => {
    dispatch({type:'UPDATE',payload:{name: e.target.value}})
  }
  return <div>
    变动输入框：<input value={state.user.name}
                 onChange={changeValue}/>
  </div>
})
const InputView = () => {
  const contextValue = useContext(appContext)
  return <div>变动实时显示用户名：{contextValue.appState.user.name}</div>
}
const Item4 = () => <div>不更新组件</div>
export default App;
