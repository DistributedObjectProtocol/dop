import React, { Component, PropTypes } from 'react'
import { createObserver } from 'dop'
import state from '../state'
import { completeAll } from '../actions'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants'
import TodoItem from './TodoItem'


const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}

export default class MainSection extends Component {

  componentWillMount() {
    const observer = createObserver(mutations => {
      this.forceUpdate()
    })
    observer.observe(state.todos, 'length')
    observer.observe(state, 'selectedFilter')
    observer.observe(state, 'itemsLeftCount')
  }

  shouldComponentUpdate() {
    return false
  }
  
  render() {
    return (
      <MainSectionTemplate 
        todos={state.todos}
        selectedFilter={state.selectedFilter}
        todoFilters={TODO_FILTERS}
        onCompleteAll={completeAll}
        />
    )
  }
}

function MainSectionTemplate({ todos, selectedFilter, todoFilters, onCompleteAll }) {
  return <div>
    <section className="main">
      <ul className="todo-list">
        {todos.reduce((list, todo, index) => {
          if (todoFilters[selectedFilter](todo))
            list.push(<TodoItem key={todo.id} index={index} />)
          return list
        }, [])}
      </ul>
    </section>
  </div>
}