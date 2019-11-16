import React from "react";
import img_yellowstars_0 from "../../../asset/images/yellowStar0.png";
import img_yellowstars_1 from "../../../asset/images/yellowStar1.png";
import img_yellowstars_2 from "../../../asset/images/yellowStar2.png";
import img_yellowstars_3 from "../../../asset/images/yellowStar3.png";
import img_yellowstars_4 from "../../../asset/images/yellowStar4.png";
import img_yellowstars_5 from "../../../asset/images/yellowStar5.png";

const imageMap = [
  img_yellowstars_0,
  img_yellowstars_1,
  img_yellowstars_2,
  img_yellowstars_3,
  img_yellowstars_4,
  img_yellowstars_5
];

const PackageRating = ({ rating, reviewCount, style = {} }) => {
  return (
    <div className="listTitle" style={style}>
      <img src={imageMap[Math.floor(rating)]} alt="" />
      <span>
        <b>{rating}</b> of 5
      </span>
    </div>
  );
};

PackageRating.defaultProps = {
  reviewCount: 0
};
export default PackageRating;
