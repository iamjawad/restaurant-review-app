import React from 'react';
import Restaurant from './Restaurant';
import RestaurantFilter from './RestaurantFilter';
// import * as data from './data.json';
import NewRestaurant from './NewRestaurant';

// window.db = data.default;

class RestaurantList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeId:-1,
            db: [...window.db],
            displayNewRest:false
        };

        this.handleClick = this.handleClick.bind(this);
        this.updateDb = this.updateDb.bind(this);
    }

    handleHover() {
        console.log("Hover");
    }
    
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.length !== this.state.length) {
    //         this.setState({
    //             db: window.db
    //         });
    //         console.log("AAAAAA");
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.state.db) !== JSON.stringify(window.db)) {
            // window.db[this.props.id].ratings = this
            this.setState({db: [...window.db]});
            console.log("fsdfsdfsdfsdfs");
            
        }
    }

    // componentDidMount(){
    //     this.setState({
    //         db: [...window.db]
    //     });
    // }

    updateDb() {
        this.setState({
            db: [...window.db]
        });
        this.props.updateMap();
    }

    handleClick(id) {
        this.setState({activeId:id}, console.log(this.state.activeId));
    }

    render() {
        const restaurants = this.props.children;
        return(
            <div className="">
                <RestaurantFilter newrest={() => this.setState({displayNewRest:!this.state.displayNewRest})}/>
                <NewRestaurant coords={this.props.coords} toggle={() => this.setState({displayNewRest:!this.state.displayNewRest})} display={this.state.displayNewRest}  db={this.state.db} update={this.updateDb} />
                <div className="restaurants">
                    {this.state.db.map((restaurant, i) => 
                        <Restaurant update={this.updateDb} key={i} selected={this.state.activeId} id={i} name={restaurant.restaurantName} address={restaurant.address} click={this.handleClick} reviews={restaurant.ratings} active={this.state.activeId}/>)}
                </div>
                
            </div>
        );
    }
}

export default RestaurantList;