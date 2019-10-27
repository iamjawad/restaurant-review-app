import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';

class Review extends React.Component {

    render() {
        return(
            <div className="reviews-box">
                <div className="user-name">{this.props.user}</div>
                <div className="user-rating">
                    <span className="stars-count">{this.props.stars}</span>
                    {this.props.ratingIcon(this.props.stars)}
                </div>
                <div className="user-review">{this.props.comment}</div>
            </div>
        );
    }
}

export default Review;