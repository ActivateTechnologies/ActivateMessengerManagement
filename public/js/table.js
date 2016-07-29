const React = require('react');
const ReactDOM = require('react-dom');
const Reactable = require('reactable')

var props = document.getElementById('#text').innerHTML

var Table = Reactable.Table;
ReactDOM.render(
    <Table sortable={true} className="table" data={props} />,
    document.getElementById('example')
);
