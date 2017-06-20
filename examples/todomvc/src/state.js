import { register, computed } from 'dop';
import { SHOW_ALL } from './constants';

// Initial state
export default register({
    newTodoText: '',
    todos: [],
    selectedFilter: SHOW_ALL,
    itemsLeftCount: computed(function() {
        return this.todos.reduce(
            (sum, todo) => sum + (todo.completed ? 0 : 1),
            0
        );
    }),
    areAllItemsCompleted: computed(function() {
        return this.todos.length > 0 && this.itemsLeftCount === 0;
    }),
    completedCount: computed(function() {
        return this.todos.length - this.itemsLeftCount;
    })
});
