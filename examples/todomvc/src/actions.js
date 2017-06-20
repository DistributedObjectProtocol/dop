import { collect } from 'dop';
import state from './state';

export function changeTextNewTodo(text) {
    state.newTodoText = text;
}

let todoIdInc = 1;
export function addTodo(text) {
    if (text.length > 0) {
        const collector = collect()
        changeTextNewTodo('')
        state.todos.push({
            text: text,
            completed: false,
            id: todoIdInc++,
            editing: false
        });
        collector.emit()
    }
}

export function deleteTodo(id) {
    const index = state.todos.findIndex(todo => todo.id === id);
    const collector = collect();
    state.todos.splice(index, 1);
    collector.emit();
}

export function editTodo(id, text) {
    if (text.length === 0)
        deleteTodo(id);
    else {
        const todo = state.todos.filter(todo => todo.id === id)[0];
        const collector = collect();
        if (text !== todo.text)
            todo.text = text;
        collector.emit();
    }
}

export function completeTodo(id) {
    const todo = state.todos.filter(todo => todo.id === id)[0];
    const collector = collect();
    todo.completed = !todo.completed;
    collector.emit();
}

export function completeAll() {
    const collector = collect();
    const areAllMarked = state.todos.every(todo => todo.completed);
    state.todos.forEach(todo => (todo.completed = !areAllMarked));
    collector.emit();
}

export function changeFilter(filter) {
    state.selectedFilter = filter;
}

export function clearCompleted() {
    const collector = collect();
    const completeds = state.todos
        .filter(todo => todo.completed === true)
        .map(todo => todo.id)
        .forEach(deleteTodo);
    collector.emit();
}

export function editingTodo(id) {
    const todo = state.todos.filter(todo => todo.id === id)[0];
    todo.editing = !todo.editing;
}
