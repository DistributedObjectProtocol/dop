import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { createObserver, getObjectPath } from 'dop';
import store from '../store';
import { editTodo, completeTodo, deleteTodo, editingTodo } from '../actions';

export default class TodoItem extends Component {

    constructor(props) {
        super(props)
        this.onChangeText = this.onChangeText.bind(this)
        this.onEditingTodo = this.onEditingTodo.bind(this)
        this.onKeyEnter = this.onKeyEnter.bind(this)
        this.onCompleteTodo = this.onCompleteTodo.bind(this)
        this.onDeleteTodo = this.onDeleteTodo.bind(this)
    }

    componentWillMount() {
        this.todo = store.todos[this.props.index]
        this.observer = createObserver(m => this.forceUpdate());
        this.unobserveTodo = this.observer.observe(this.todo)
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.index !== this.props.index) {
            this.unobserveTodo()
            this.todo = store.todos[nextProps.index]
            this.unobserveTodo = this.observer.observe(this.todo)
        }
        return false;
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    onChangeText(e) {
        editTodo(this.todo.id, e.target.value.trim())
    }

    onEditingTodo() {
        editingTodo(this.todo.id)
    }

    onKeyEnter(e) {
        if (e.which === 13)
            this.onEditingTodo()
    }

    onCompleteTodo() {
        completeTodo(this.todo.id)
    }

    onDeleteTodo() {
        deleteTodo(this.todo.id)
    }

    render() {
        return (
            <TodoItemTemplate
                todo={this.todo}
                onChangeText={this.onChangeText}
                onBlur={this.onEditingTodo}
                onKeyEnter={this.onKeyEnter}
                onCompleteTodo={this.onCompleteTodo}
                onDoubleClick={this.onEditingTodo}
                onDeleteTodo={this.onDeleteTodo}
            />
        );
    }
}

function TodoItemTemplate({ todo, onChangeText, onBlur, onKeyEnter, onCompleteTodo, onDoubleClick, onDeleteTodo}) {
    let element
    if (todo.editing) {
        element = (
            <input
                className="edit"
                type="text"
                autoFocus="true"
                value={todo.text}
                onChange={onChangeText}
                onBlur={onBlur}
                onKeyDown={onKeyEnter}
            />
        )
    } else {
        element = (
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={onCompleteTodo}
                />
                <label onDoubleClick={onDoubleClick}>
                    {todo.text}
                </label>
                <button className="destroy" onClick={onDeleteTodo} />
            </div>
        )
    }

    return (
        <li
            className={classnames({
                completed: todo.completed,
                editing: todo.editing
            })}
        >
            {element}
        </li>
    );
}
