import React, { Component, PropTypes } from 'react'
import { createObserver } from 'dop'
import state from '../state'
import { addTodo, completeAll } from '../actions'
import TodoInput from './TodoInput'


export default class Header extends Component {

  componentWillMount() {
    const observer = createObserver(mutations => {
      this.forceUpdate()
    })
    observer.observe(state, 'areAllItemsCompleted')
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <HeaderTemplate 
      onSave={addTodo}
      onCompleteAll={completeAll}
      areAllItemsCompleted={state.areAllItemsCompleted}
    />
  }
}




function HeaderTemplate({ onSave, onCompleteAll, areAllItemsCompleted }) {
  return (
    <header className="header">
      <h1>todos</h1>
      <TodoInput
        newTodo
        placeholder="What needs to be done?"
        onSave={onSave}/>
      <input className="toggle-all"
        type="checkbox"
        checked={areAllItemsCompleted}
        onChange={onCompleteAll} />
    </header>
  )
}