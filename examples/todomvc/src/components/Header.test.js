import React from 'react'
import renderer from 'react-test-renderer';
import Header from './Header'


test('Adding a new todo', () => {
  const component = renderer.create(
    <Header />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually changed input new todo
  let newtodotext = "New todo"
  tree.children[1].props.onChange({target:{value:newtodotext}})
  // re-rendering
  tree = component.toJSON();
  expect( tree.children[1].props.value).toBe(newtodotext)

  // saving new todo manually
  tree.children[1].props.onKeyDown({which:13,target:{value:newtodotext}})
  // re-rendering
  tree = component.toJSON();
  expect(tree.children[1].props.value).toBe("")
  expect(tree).toMatchSnapshot();
});

