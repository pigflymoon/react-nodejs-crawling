import React from 'react';

export default class App extends React.Component {

    renderList() {

        return (
            <ul>
                {this.props.itemList.map((item, index) => (
                    <li key={index}>
                        <a href={item.link}>{item.title}</a>
                        <p>{item.price}</p>
                    </li>
                )) }
            </ul>
        )
    }

    render() {
        return (
            <div>
                <h1>hello, your searched {this.props.searchKey} filter list</h1>
                {this.renderList()}
            </div>
        );
    }
}
