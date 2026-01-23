import {useEffect,useReducer} from 'react'
import axios from "axios";
import TodoItem from './components/TodoItem';
import FilterButtons from './components/FilterButtons';
import SearchBox from './components/SearchBox';
import { normalizePath } from 'vite';
import cypress from 'cypress';



interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

const initialState = {
  texts: '',
  list:  [] as Todo[],
  filter: 'all' as 'all' | 'completed' | 'incomplete',
  searchTerm: '',
  editId: null as number | null,
  editText: '',
};

function reducer(state: typeof initialState, action: any): typeof initialState {
  switch (action.type) {
    case 'SET_TEXTS':
      return { ...state, texts: action.payload };

 case 'DELETE_TODO':
  return {
    ...state,
    list: state.list.filter((item) => item.id !== action.payload),
  };


     case 'SWITCH_TODO':
  const switchTarget = state.list.find(item => item.id === action.payload);
  if (!switchTarget) return state;

  const toggled = { ...switchTarget, isCompleted: !switchTarget.isCompleted };
  axios.put(`http://localhost:3001/todos/${action.payload}`, toggled);

  return {
    ...state,
    list: state.list.map((item) =>
      item.id === action.payload ? toggled : item
    ),
  };

    case 'EDIT':
      const target = state.list.find((item) => item.id === action.payload);
      return target ? { ...state, editId: target.id, editText: target.text } : state;
    case 'SET_EDIT_TEXT':
      return { ...state, editText: action.payload };
   case 'CONFIRM_EDIT':
  axios.put(`http://localhost:3001/todos/${state.editId}`, {
    ...state.list.find(item => item.id === state.editId),
    text: state.editText,
  });

  return {
    ...state,
    list: state.list.map((item) =>
      item.id === state.editId ? { ...item, text: state.editText } : item
    ),
    editId: null,
    editText: '',
  };

    case 'SET_LIST':
    return { ...state, list: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
}


export default function TextBox() {
  const [state, dispatch] = useReducer(reducer, initialState);


useEffect(() => {
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')

    if (!error) {
      dispatch({ type: 'SET_LIST', payload: data })
    }
  }

  fetchTodos()
}, [])

const deleteTodo = async (id: number) => {
  await supabase.from('todos').delete().eq('id', id)
  dispatch({ type: 'DELETE_TODO', payload: id })
}




  const showList = state.list
    .filter((item) => {
      if (state.filter === "completed") return item.isCompleted;
      if (state.filter === "incomplete") return !item.isCompleted;
      return true;
    })
    .filter((item) =>
      item.text.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

   return (

 <div className="container py-4">

    <div className='my-3'>
      <input
        type="text"
        value={state.texts}
        onChange={(e) => dispatch({ type: 'SET_TEXTS', payload: e.target.value })}
        className="border border-dark"
        style={{ height: '40px', fontSize: '20px' }}
        placeholder="タスクを追加"
      />
      
     <button
  data-test="add-task"
  className="btn btn-primary"
  style={{ height: '45px' }}
  onClick={async () => {
    if (state.texts === '') {
      alert('空欄です');
      return;
    }

    if (state.texts.length > 30) {
      alert('30文字以内で入力してください');
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([
        { text: state.texts, is_completed: false }
      ])
      .select();

    if (error) {
      alert('追加に失敗しました');
      return;
    }

    dispatch({
      type: 'SET_LIST',
      payload: [...state.list, data![0]],
    });

    dispatch({ type: 'SET_TEXTS', payload: '' });
  }}
>
  追加
</button>

     </div>

     <FilterButtons
        filter={state.filter}
        setFilter={(f) => dispatch({ type: 'SET_FILTER', payload: f })}
     />
    
    <div className="row">
       
        {showList.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            editId={state.editId}
            editText={state.editText}
            setEditText={(val) => dispatch({ type: 'SET_EDIT_TEXT', payload: val })}
            Edit={(id) => dispatch({ type: 'EDIT', payload: id })}
            ConfirmEdit={() => dispatch({ type: 'CONFIRM_EDIT' })}
            Switch={(id) => dispatch({ type: 'SWITCH_TODO', payload: id })}
            Delete={(id) => deleteTodo(id)}

          />
        ))}
      </div>

      <SearchBox
        searchTerm={state.searchTerm}
        setSearchTerm={(val) => dispatch({ type: 'SET_SEARCH', payload: val })}
      />
      
     
    </div>
  );
}

// json-server --watch db.json --port 3001
// npx json-server --watch db.json --port 3001

// npm run dev
// npx cypress open
// npx cypress run