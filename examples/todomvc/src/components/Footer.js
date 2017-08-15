import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { createObserver } from 'dop';
import store from '../store';
import { clearCompleted, changeFilter } from '../actions';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants';

const FILTER_TITLES = {
    [SHOW_ALL]: 'All',
    [SHOW_ACTIVE]: 'Active',
    [SHOW_COMPLETED]: 'Completed'
};

export default class Footer extends Component {
    componentWillMount() {
        const observer = createObserver(m => this.forceUpdate());
        observer.observe(store, 'itemsLeftCount');
        observer.observe(store, 'selectedFilter');
        observer.observe(store, 'completedCount');
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <FooterTemplate
                activeCount={store.itemsLeftCount}
                completedCount={store.completedCount}
                selectedFilter={store.selectedFilter}
                onChangeFilter={changeFilter}
                onClearCompleted={clearCompleted}
            />
        );
    }
}

function FooterTemplate({ activeCount, completedCount, selectedFilter, onChangeFilter, onClearCompleted }) {
    const itemWord = activeCount === 1 ? 'item' : 'items';

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{activeCount || 'No'}</strong> {itemWord} left
            </span>
            <ul className="filters">
                {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter =>
                    <li key={filter}>
                        <a
                            className={classnames({
                                selected: filter === selectedFilter
                            })}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onChangeFilter(filter)}
                        >
                            {FILTER_TITLES[filter]}
                        </a>
                    </li>
                )}
            </ul>
            {completedCount === 0
                ? null
                : <button
                      className="clear-completed"
                      onClick={onClearCompleted}
                  >
                      Clear completed
                  </button>}
        </footer>
    );
}
