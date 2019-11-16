import React from 'react';
import img_yellowstars_0 from "../../asset/images/yellowStar0.png";
import img_yellowstars_1 from "../../asset/images/yellowStar1.png";
import img_yellowstars_2 from "../../asset/images/yellowStar2.png";
import img_yellowstars_3 from "../../asset/images/yellowStar3.png";
import img_yellowstars_4 from "../../asset/images/yellowStar4.png";
import img_yellowstars_5 from "../../asset/images/yellowStar5.png";

const imageMap = [
  img_yellowstars_0,
  img_yellowstars_1,
  img_yellowstars_2,
  img_yellowstars_3,
  img_yellowstars_4,
  img_yellowstars_5
];

const UserRating = ({ rating, reviewCount }) => {

  return (
    <div className="listTitle">
      <img src={imageMap[Math.floor(rating)]} alt="" />
      <span>
        <b>{rating}</b> of 5
        {/* <b>{rating}</b> of 5 <small>({reviewCount} reviews)</small> */}
      </span>
    </div>
  );
}

UserRating.defaultProps = {
  reviewCount: 0
}
export default UserRating;