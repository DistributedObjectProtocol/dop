import React from 'react'
import renderer from 'react-test-renderer';
import Footer from './Footer'
import { addTodo, completeTodo } from '../actions'

let component
test('Checking item lefts', () => {
  component = renderer.create(
    <Footer />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // No items left
  expect(tree.children[0].children[2]).toBe('items')
  expect(tree.children[0].children[0].children[0]).toBe('No')

  // Adding todo manually
  const labelnewtodo = 'My new todo'
  addTodo(labelnewtodo)
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // 1 item left
  expect(tree.children[0].children[2]).toBe('item')
  expect(tree.children[0].children[0].children[0]).toBe(1)

  // Adding todo manually
  addTodo('My new todo 2')
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // 2 item left
  expect(tree.children[0].children[2]).toBe('items')
  expect(tree.children[0].children[0].children[0]).toBe(2)

  // Completing todo manually
  completeTodo(1)
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // 1 item left
  expect(tree.children[0].children[2]).toBe('item')
  expect(tree.children[0].children[0].children[0]).toBe(1)
});

