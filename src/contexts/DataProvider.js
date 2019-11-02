import React from 'react';
import DataContext from './DataContext';
import data from './../data.json';

class DataProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            db: [...data]
        }

        this.addRestaurant = this.addRestaurant.bind(this);
        this.addRating = this.addRating.bind(this);
        this.getReviews = this.getReviews.bind(this);

    }

    getReviews(restaurantID) {
        let db = [...this.state.db];
        let restaurant = db.find( (element) => {
            return element.id === restaurantID;
        })
    
        if( restaurant ) {
            return restaurant.ratings;
        }

        return [];
        
    }

    addRating(restaurantID, rating) {

        let db = [...this.state.db];
        const addition = db.find(function(element) {
            return element.id === restaurantID;
        })

        if( addition ) { 
            addition.ratings.push(rating);
            this.setState({db: db}) 
        };
 
    }

    addRestaurant(restaurants) {
        const db = [...this.state.db, ...restaurants];
        this.setState({db:db});
        // restaurants.forEach(restaurant => {
        //     this.setState(state => {
        //         // const db = [...state.db, {stars: this.state.stars, comment: this.state.comment}];
        //         return {
        //             stars:0,
        //             comment:'',
        //         };
        //     },console.log(this.state.db));
        // });
    }

    render() {
        return(
            <DataContext.Provider value={{restaurants: this.state.db, addRestaurant:this.addRestaurant, addRating:this.addRating, getReviews: this.getReviews}}>
                {this.props.children}
            </DataContext.Provider>
        );
    }
}

export default DataProvider;