import React from 'react';
import RestaurantList from './RestaurantList';
import { thisExpression } from '@babel/types';
import Filter from './Filter';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterString: ""
        }

        this.changeFilter = this.changeFilter.bind(this);

        this.restaurants = [
            {
                id:1,
                name:"Shinwari Tika",
                address:"Prince road quetta"
            },
            {
                id:2,
                name:"Tandoori Chai",
                address:"Airport road quetta"
            },

        ]
    }

    handleClick(){

    }

    changeFilter(filter) {
        this.setState({filterString: filter});
    }

    render() {
        return (
            <div className="sidebar">
                <header>
                    <div className="title">Restaurants Newarby</div>
                    <Filter value={this.state.filterString} change={this.changeFilter} />
                </header>
                <RestaurantList filter={this.state.filterString} coords={this.props.coords} updateMap={this.props.updateMap} restaurants={this.restaurants} />

            </div>
        );
    }
}

export default Sidebar;