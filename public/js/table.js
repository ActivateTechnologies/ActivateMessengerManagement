const React = require('react');
const ReactDOM = require('react-dom');
const Reactable = require('reactable');
const $ = require('jquery')

var props = [];
$.get('http://localhost:3000/tabledata', function(data){
  props = data.data;
  console.log(props);
  var Table = Reactable.Table;
  ReactDOM.render(
      <Table sortable={true} className="table" data={props} />,
      document.getElementById('example')
  );
})

// var Table = Reactable.Table;
// ReactDOM.render(
//     <Table sortable={true} className="table" data={[
//         { Name: 'Griffin Smith', Age: 18 },
//         { Age: 23,  Name: 'Lee Salminen' },
//         { Age: 28, Position: 'Developer' },
//     ]} />,
//     document.getElementById('example')
// );
