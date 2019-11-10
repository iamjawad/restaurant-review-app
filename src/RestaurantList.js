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
            displayNewRest:false,
            filterString: "",
            startRange:1,
            endRange:5
        });
    }

    handleHover() {
        console.log("Hover");
    }

    ratingsFilter(ratings) {
        if (ratings != null) {
            const rangeStart = this.state.startRange;
            const rangeEnd = this.state.endRange;
            let rating = 0;

            ratings.forEach(element => {
                rating += element.stars;
            });

            let avgRating = rating / ratings.length;
            console.log(avgRating);
            if(avgRating >= rangeStart && avgRating <= rangeEnd) {
                return true;
            }

            return false;


        }
    }

    filter(name, address, ratings) {
        const filterString = this.props.filter.toUpperCase();
        address = address.toUpperCase().split(' ');
        name = name.toUpperCase();

        if (!this.ratingsFilter(ratings)) {
            return false;
        }

        if(filterString === "" || filterString === undefined) {
            return true;
        }
        
        if ( name.startsWith(filterString) || 
            address.find((element) => { return element.startsWith(filterString) })) {
            
            return true;
        } else {
            return false;
        }
    }

    handleClick(id) {
        this.setState({activeId:id});
    }

    render() {
        return(
            <div className="">
                <RestaurantFilter updateRange={(range) => {this.setState({startRange:range[0],endRange:range[1]})}} newrest={() => this.setState({displayNewRest:!this.state.displayNewRest})}/>
                <NewRestaurant toggle={() => this.setState({displayNewRest:!this.state.displayNewRest})} display={this.state.displayNewRest}  db={this.state.db} />
                <DataContext.Consumer>
                {context => (
                    <div className="restaurants">
                        {context.restaurants.map((restaurant, i) => 
                            this.filter(restaurant.restaurantName, restaurant.address, restaurant.ratings) ?
                            <Restaurant key={i} selected={this.state.activeId} 
                            id={restaurant.id} name={restaurant.restaurantName} 
                            address={restaurant.address} click={this.handleClick} 
                            reviews={restaurant.ratings} active={this.state.activeId}/> : false)}
                    </div>
                )}
                </DataContext.Consumer>
            </div>
        );
    }
}

export default RestaurantList;