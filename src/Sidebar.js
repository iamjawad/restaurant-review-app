import React from 'react';
import RestaurantList from './RestaurantList';
import { thisExpression } from '@babel/types';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

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

    render() {
        return (
            <div className="sidebar">
                <header>
                    <div className="title">Restaurants Newarby</div>
                </header>
                <RestaurantList coords={this.props.coords} updateMap={this.props.updateMap} restaurants={this.restaurants} />

            </div>
        );
    }
}

export default Sidebar;