const React = require('react');
const ReactDOM = require('react-dom');
const Reactable = require('reactable')

var Table = Reactable.Table;
ReactDOM.render(
    <Table sortable={true} className="table" data={[
        { Name: 'Griffin Smith', Age: 18 },
        { Age: 23,  Name: 'Lee Salminen' },
        { Age: 28, Position: 'Developer' },
    ]} />,
    document.getElementById('example')
);
