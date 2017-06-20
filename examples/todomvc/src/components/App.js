import React, { Component, PropTypes } from 'react';
import Header from './Header';
import Todos from './Todos';
import Footer from './Footer';

export default function App() {
    return (
        <div>
            <Header />
            <Todos />
            <Footer />
        </div>
    );
}
