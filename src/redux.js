import React, {useEffect, useState} from "react";
let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) =>{
    state = newState
    listeners.map(fn => fn(state))
}
export const appContext = React.createContext(null)

const store = {
    getState: () => {
        return state
    },
    dispatch: (action) => {
        setState(reducer(state, action))
    },
    subscribe(fn) {
        listeners.push(fn)
        return () => {
            const index = listeners.indexOf(fn)
            listeners.splice(index, 1)
        }
    }
}
export const createStore = (_reducer, initState) => {
    state = initState
    reducer = _reducer
    return store
}
const change = (oldData, newData) => {
    let changed = false
    for(let key in oldData) {
        if (oldData[key] !== newData[key]) {
            changed = true
        }
    }
    return changed
}
// connect 将组件与全局状态联系在一起
const dispatch = store.dispatch
export const connect = (selector, mapDispatchToProps) => (Component) => {
    return (props) => {
        const [, update] = useState({})
        const state = store.getState()
        const data = selector ? selector(state) : {state}
        const dispatcher= mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
        useEffect(() => {
            return store.subscribe(() => {
                const newState = store.getState()
                const newData = selector ? selector(newState) : {newState}
                if (change(data,newData)) {
                    console.log('update-data')
                    update({})
                }

            })
        }, [selector])

        return <Component {...props} {...data} {...dispatcher}/>
    }
}
export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}