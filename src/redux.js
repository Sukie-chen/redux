import React, {useContext, useEffect, useState} from "react";

export const appContext = React.createContext(null)
export const store = {
    state: {
        user: {name: 'Sunny', age: 18},
        group: {name: 'web'}
    },
    setState(newState) {
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
export const connect = (selector, mapDispatchToProps) => (Component) => {
    return (props) => {
        const {state, setState} = useContext(appContext)
        const [, update] = useState({})
        const data = selector ? selector(state) : {state}
        const dispatch = (action) => {
            setState(reducer(state, action))
        }
        const dispatcher= mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
        useEffect(() => {
            return store.subscribe(() => {
                const newData = selector ? selector(store.state) : {state: store.state}
                if (change(data,newData)) {
                    console.log('update-data')
                    update({})
                }

            })
        }, [selector])

        return <Component {...props} {...data} {...dispatcher}/>
    }
}