import React from 'react'
import renderer from 'react-test-renderer';
import Todos from './Todos'
import { addTodo } from '../actions'

let component
test('Adding a new todo', () => {
  component = renderer.create(
    <Todos />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // Adding todo manually
  const labelnewtodo = 'My new todo'
  addTodo(labelnewtodo)
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // Checking the todo has been added
  let todoelement = tree.children[0].children[0].children[0].children[0].children[1]
  expect(todoelement.type).toMatchSnapshot('label');
  expect(todoelement.children[0]).toMatchSnapshot(labelnewtodo);
});


test('Removing todo', () => {
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  
  // removeTodo manually
  let buttonchildrencomponent = tree.children[0].children[0].children[0].children[0].children[2]
  buttonchildrencomponent.props.onClick()

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  expect(tree.children[0].children[0].children).toBe(null);
})
