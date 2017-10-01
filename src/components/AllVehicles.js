import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AllVehicles extends Component {
  render() {
    if (this.props.if) {
      return (
        <section className="all-vehicles">
          {/* console.log(this.props.data) */}
          <h1 className="section-heading">Alla fordon</h1>
          <div className="filter-container">
            <p>filter här kommer här</p>
          </div>
          <div className="vehicle-search-head">
            <span>Bild</span>
            <span>Märke</span>
            <span>Modell</span>
            <span>Typ</span>
            <span>Dygnspris</span>
          </div>
          <ul>
            {this.props.data.map((vehicle, index) => {
              //console.log(vehicle);
              return (
                <li key={index} data-id={vehicle._id} onClick={this.props.vehicleBooking}>
                  <div className="image-container">
                    <img src={vehicle.photo || "http://via.placeholder.com/150x150"} alt="" width="120"/>
                  </div>
                  <span>{vehicle.brand}</span> <span>{vehicle.model}</span>
                  <span>{vehicle.type}</span> <span>{vehicle.price}:-</span>
                </li>
              );
            })}
          </ul>
        </section>
      );
    } else {
      return null;
    }
  }
}
//bild, brand, model, (typ av bil), pris

AllVehicles.propTypes = {
  data: PropTypes.array.isRequired,
  vehicleBooking: PropTypes.func.isRequired,
  if: PropTypes.bool.isRequired
};

// TODO: check if merged correctly