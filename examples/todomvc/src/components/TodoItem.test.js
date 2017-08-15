import React from 'react'
import renderer from 'react-test-renderer';
import TodoItem from './TodoItem'
import { addTodo, editTodo } from '../actions'
import store from '../store'

let component
let idtodo = 1
let indextodo = 0
test('Adding a new todo', () => {  
  // Adding todo manually
  const labelnewtodo = 'My new todo'
  addTodo(labelnewtodo)

  component = renderer.create(
    <TodoItem index={indextodo} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  let labelcomponent = tree.children[0].children[1]
  expect(labelcomponent.type).toBe('label')
  expect(labelcomponent.children[0]).toBe(labelnewtodo)
});


test('Editing todo', () => {
  const labelnewtodo = 'Label changed'
  editTodo(idtodo, 'Label changed')
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  let labelcomponent = tree.children[0].children[1]
  expect(labelcomponent.children[0]).toBe(labelnewtodo)
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});