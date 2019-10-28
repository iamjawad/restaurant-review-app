import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';
import { faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Review from './Review';
import NewReview from './NewReview';

class Restaurant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detailCarot: faCaretDown,
            active: false,
            selected: this.props.selected,
            avgRating: 0,
            reviews: [this.props.reviews]
        }
        
        this.showDetails = this.showDetails.bind(this);
        this.updateReviews = this.updateReviews.bind(this);
    }

    showDetails(){

        if(this.props.selected === this.props.id && this.state.active === true) {
            this.setState({active: false});
            return;
        }

        this.props.click(this.props.id);
        

        setTimeout(() => {
        
        if( this.props.selected === this.props.id) {
            this.setState({detailCarot: faCaretUp});
            this.setState({active: true});
        } else {
            this.setState({detailCarot: faCaretDown});
            this.setState({active: false});
        }
        }, 100);
        
    }

    updateReviews(updatedReviews = 0) {
        // this.setState({
        //     reviews: [...updatedReviews]
        // });
        this.setState({reviews: [...window.db[this.props.id].ratings]});
        // this.props.update();
    }

    isActive(){
        return this.props.selected === this.props.id;
        // return this.props.active === this.props.id && this.state.active;
    }

    getAvgRating() {
        let avgRating = 0;
        let reviews = 0;
        this.props.reviews.map((review, i) => {
            avgRating += review.stars;
            reviews++;
        }
            
        );

        const totalRating = (avgRating / reviews).toFixed(2);
        return isNaN(totalRating) ? 0 : totalRating;
    }

    getStars(rating) {
        const starsCount = rating;
        let stars = [];
        for (let index = 0; index < 5; index++) {
            if(index === Math.ceil(starsCount) - 1 && (starsCount % 1 === 0) === false){
                stars.push(<FontAwesomeIcon key={index} icon={faStarHalf} />);
            } else if(index < Math.ceil(starsCount)) {
                stars.push(<FontAwesomeIcon key={index} icon={faStar} />);
            } else {
                stars.push(<FontAwesomeIcon key={index} icon={farStar} />);
            }
        }
        return stars;
    }

    render() {
        return(
            <div className="restaurant">
                <div className="contents">
                    <a href="#" className="show-details" onClick={this.showDetails}>
                        <div className="basic-info">
                            <div className="res-name">{this.props.name}</div>
                            <span>{this.getAvgRating()}</span>
                            <span className="avg-stars">{this.getStars(this.getAvgRating())}</span>
                            <span className="reviews-count">({this.props.reviews.length})</span>
                            <div className="res-address">{this.props.address}</div>
                            <FontAwesomeIcon className="caret" icon={this.props.selected === this.props.id && this.state.active ? faCaretUp : faCaretDown} />
                        </div>
                    </a>
                    <div className="detail-info" style={{display: this.props.selected === this.props.id && this.state.active ? "block" : "none"}}>
                        <div><span className="sectiong-title">Reviews</span></div><hr />
                        <NewReview id={this.props.id} update={this.updateReviews} db={this.props.reviews} />
                        {this.props.reviews.map((review, i) => 
                            <Review key={i} stars={review.stars} comment={review.comment} ratingIcon={this.getStars}/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Restaurant;