import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CommentSlider.css'; // Import the CSS file for custom styles

const CommentSLider = () => {
    const comments = [
      {
        id: 1,
        text: 'This is the first comment.',
        author: 'John Doe',
      },
      {
        id: 2,
        text: 'This is the second comment.',
        author: 'Jane Smith',
      },
      {
        id: 3,
        text: 'This is the third comment.',
        author: 'Bob Johnson',
      },
    ];
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {comments.map((comment) => (
            <div key={comment.id} className="comment-container">
              <p className="comment-text" style={{color:'black'}}>{comment.text}</p>
              <small className="comment-author">- {comment.author}</small>
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default CommentSLider;