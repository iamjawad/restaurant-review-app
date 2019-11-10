import React from 'react';

class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        }
    }


    render() {
        return(
            <div className="search-box">
                <div className="input-box">
                    <input className="search-input" onChange={e => this.props.change(e.target.value)} value={this.props.filterSting} placeholder="Filter restaurants..." />
                </div>
            </div>
        );
    }
}

export default Filter;