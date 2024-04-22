import './App.scss'
import Header from './components/Header'
import Editor from './components/Editor'
import List from './components/List'
import { useRef, useReducer, useCallback, createContext, useMemo } from 'react'

const mockData = [
  {
    id: 0,
    isDone: false,
    content: "React 공부하기",
    date: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "빨래하기",
    date: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "노래하기",
    date: new Date().getTime(),
  },
]

function reducer(state, action) {
  switch(action.type) {
    case 'CREATE': 
      return [action.data, ...state]
    case 'UPDATE':
      return state.map(
        (item)=>item.id === action.targetId ? {...item, isDone: !item.isDone} :item
      )
    case 'DELETE':
      return state.filter((item)=>item.id !== action.targetId)
    default :
      return state;
  }
}

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

function App() {
  // 컴포넌트 안에서 context를 선언하면 리렌더링 될 때마다 새로운 context를 생성함
  // const TodoContext = createContext();

  const [todos, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(3)

  // const onCreate = (content) => {
  //   dispatch({
  //     type: "CREATE",
  //     data: {
  //       id: idRef.current++,
  //       isDone: false,
  //       content: content,
  //       date: new Date().getTime(),
  //     }
  //   })
  // }

  const onCreate = useCallback((content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        isDone: false,
        content: content,
        date: new Date().getTime(),
      }
    })
  }, [])

  // const onUpdate = (targetId) => {
  //   dispatch({
  //     type: "UPDATE",
  //     targetId: targetId
  //   })
  // }

  const onUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE",
      targetId: targetId
    })
  }, [])

  // const onDelete = (targetId) => {
  //   dispatch({
  //     type: "DELETE",
  //     targetId: targetId
  //   })
  // }

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId: targetId
    })
  }, [])

  const memoizedDispatch = useMemo(()=>{
    return {onCreate, onUpdate, onDelete}
  }, [])

  return (
    <div className='App'>
      <Header />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider
          value={memoizedDispatch}
        >
          <Editor  />
          <List />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  )
}

export default App
