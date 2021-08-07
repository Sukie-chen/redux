import React, {useContext, useEffect, useState} from "react";
import './App.css';
const appContext = React.createContext(null)
const store = {
  state: {
    user: {name: 'Sunny', age: 18 }
  },
  setState(newState){
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}
// connect 将组件与全局状态联系在一起
const connect = (Component) => {
  return (props) => {
    const {state, setState} = useContext(appContext)
    const [, update] = useState({})
    useEffect(()=> {
      store.subscribe( ()=> {
        update({})
      })
    }, [])
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}
function App() {
  return (
    <appContext.Provider  className="App" value={store}>
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
const InputItem =connect(({dispatch, state}) => {
  console.log('InputItem----', Math.random())
  const changeValue = (e) => {
    dispatch({type:'UPDATE',payload:{name: e.target.value}})
  }
  return <div>变动输入框：<input value={state.user.name}
                 onChange={changeValue}/>
  </div>
})
const InputView = connect(({state}) => {
  return <div>变动实时显示用户名：{state.user.name}</div>
})
const Item4 = () => {
  console.log('Item4-----',Math.random())
  return  <div>不更新组件</div>
}
export default App;
