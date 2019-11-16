import React from 'react';

export default class ContentContainer extends React.Component {
   
  render() {
    return (
      <div className="leftSide">
         {this.props.children}
     </div>
    )
  }
}