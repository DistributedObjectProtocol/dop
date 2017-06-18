import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { createObserver, getObjectPath } from 'dop'
import state from '../state'
import { editTodo, completeTodo, deleteTodo, editingTodo } from '../actions'
import TodoInput from './TodoInput'

export default class TodoItem extends Component {

  componentWillMount() {
    this.todo = state.todos[this.props.index]
    this.observer = createObserver(() => {
      this.forceUpdate()
    })
    this.observer.observe(this.todo)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.index !== this.props.index) {
      this.observer.unobserve(this.todo)
      this.todo = state.todos[nextProps.index]
      this.observer.observe(this.todo)
    }
    return false
  }


  componentWillUnmount() {
    this.observer.destroy()
  }


  render() {
    const todo = this.todo
    return <TodoItemTemplate
      todo={todo}
      onEdit={text => editTodo(todo.id, text)}
      onCompleteTodo={() => completeTodo(todo.id)}
      onDoubleClick={() => editingTodo(todo.id)}
      onDeleteTodo={() => deleteTodo(todo.id)}
      />
  }
}


function TodoItemTemplate({ todo, onEdit, onCompleteTodo, onDoubleClick, onDeleteTodo }) {

  let element
  if (todo.editing) {
    element = <TodoInput 
      text={todo.text}
      editing={todo.editing}
      onSave={onEdit} />
  }
  else {
    element = <div className="view">
        <input className="toggle"
                type="checkbox"
                checked={todo.completed}
                onChange={onCompleteTodo} />
        <label onDoubleClick={onDoubleClick}>
          {todo.text}
        </label>
        <button className="destroy" onClick={onDeleteTodo} />
      </div>
  }

  return (
    <li className={classnames({
      completed: todo.completed,
      editing: todo.editing
    })}>
      {element}
    </li>
  )
}



