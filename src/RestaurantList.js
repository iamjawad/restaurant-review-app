import React from 'react';
import Restaurant from './Restaurant';
import RestaurantFilter from './RestaurantFilter';
import NewRestaurant from './NewRestaurant';
import DataContext from './contexts/DataContext';

class RestaurantList extends React.Component {
    static contextType = DataContext;

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            activeId:-1,
            db: this.context.restaurants,
            displayNewRest:false
        });
    }

    handleHover() {
        console.log("Hover");
    }

    handleClick(id) {
        this.setState({activeId:id});
    }

    render() {
        return(
            <div className="">
                <RestaurantFilter newrest={() => this.setState({displayNewRest:!this.state.displayNewRest})}/>
                <NewRestaurant toggle={() => this.setState({displayNewRest:!this.state.displayNewRest})} display={this.state.displayNewRest}  db={this.state.db} />
                <DataContext.Consumer>
                {context => (
                    <div className="restaurants">
                        {context.restaurants.map((restaurant, i) => 
                            <Restaurant key={i} selected={this.state.activeId} id={restaurant.id} name={restaurant.restaurantName} address={restaurant.address} click={this.handleClick} reviews={restaurant.ratings} active={this.state.activeId}/>)}
                    </div>
                )}
                </DataContext.Consumer>
            </div>
        );
    }
}

export default RestaurantList;