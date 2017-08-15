import React, { Component, PropTypes } from 'react';
import { createObserver } from 'dop';
import store from '../store';
import { completeAll } from '../actions';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants';
import TodoItem from './TodoItem';

const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: todo => !todo.completed,
    [SHOW_COMPLETED]: todo => todo.completed
};

export default class Todos extends Component {
    componentWillMount() {
        const observer = createObserver(m => this.forceUpdate());
        observer.observe(store.todos, 'length');
        observer.observe(store, 'selectedFilter');
        observer.observe(store, 'itemsLeftCount');
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <TodosTemplate
                todos={store.todos}
                selectedFilter={store.selectedFilter}
                todoFilters={TODO_FILTERS}
                onCompleteAll={completeAll}
            />
        );
    }
}

function TodosTemplate({ todos, selectedFilter, todoFilters, onCompleteAll }) {
    return (
        <div>
            <section className="main">
                <ul className="todo-list">
                    {todos.reduce((list, todo, index) => {
                        if (todoFilters[selectedFilter](todo))
                            list.push(<TodoItem key={todo.id} index={index} />);
                        return list;
                    }, [])}
                </ul>
            </section>
        </div>
    );
}
