import React from 'react';
import ReactDOM from 'react-dom';

function Welcome(){
  return (
    <div>
      Hi there from Welcome component
    </div>
  )
}

ReactDOM.render(
    <Welcome/>,
    document.querySelector('main')
);
