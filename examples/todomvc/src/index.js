import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import 'todomvc-app-css/index.css'

render(<App />, document.getElementById('root'))