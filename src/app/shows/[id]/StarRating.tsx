import React from 'react';

interface StarRatingProps {
  value: number;
  maxValue?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, maxValue = 5 }) => {
  const stars = [];

  // Calculate the number of filled and empty stars
  const filledStars = Math.min(Math.max(0, value), maxValue);
  const emptyStars = maxValue - filledStars;

  // Create the filled stars
  for (let i = 0; i < filledStars; i++) {
    stars.push(
      <span key={i} className="star filled text-yellow-500">
        &#9733;
      </span>
    ); 
  }

  // Create the empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={i + filledStars} className="star empty">
        &#9733;
      </span>
    );
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
