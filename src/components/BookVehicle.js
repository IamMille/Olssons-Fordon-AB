import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DayPicker, {DateUtils} from 'react-day-picker';
import config from '../config.json';

import 'react-day-picker/lib/style.css';


export default class BookVehicle extends Component
{
    state = {
        selectedDays: [],
        disabledDays: []
    };

    componentDidMount() {
        console.log("bookVehicle did mount");
        const [selectedVehicle] = this.props.data;

        fetch(config.apiRoot + "booking/read?vehicleId=" + selectedVehicle._id)
            .then(resp => resp.json())
            .then(json => {
                let disabledDays = [];

                json.data.forEach(booking => {
                    disabledDays.push({
                        after: new Date(booking.dateFrom).addDays(-1),
                        before: new Date(booking.dateTill).addDays(1)
                    })
                });

                this.setState({ disabledDays })
            })
            .catch(error => {
                console.warn("API error:", error);
            });
        console.log("bookVehicle did mount");

    }

    handleDayClick = (day, { selected, disabled }) =>
    {
        const {selectedDays, disabledDays} = this.state;

        console.log("handleDayClick:", disabledDays);

        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            selectedDays.splice(selectedIndex, 1);
        }
        else {
            // if disabled, DONT PUSH
            console.log("push date");
            if (selectedDays.length === 0 || this.isCohesiveDate(day))
                selectedDays.push(day);
        }

        this.setState({selectedDays});
    };

    isCohesiveDate = (day) => {
        let dayAfter  = day.addDays(1);
        let dayBefore = day.addDays(-1);

        return Boolean(this.state.selectedDays.filter(d =>
            DateUtils.isSameDay(d, dayAfter) || DateUtils.isSameDay(d, dayBefore)
        ).length);
    };

    serializeUpdateObject = (obj) => {
        return Object.keys(obj).map(prop => {
            if (prop === '_id') return false;
            else return encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop])
        }).join('&')
    };

    handleSubmit = () => {
        const {selectedDays} = this.state;

        let vehicleId = this.props.data[0]._id;
        let dateTill = new Date(Math.max.apply(null,selectedDays));
        let dateFrom = new Date(Math.min.apply(null,selectedDays));
        let createBooking = {vehicleId, dateFrom, dateTill};
        console.log(this.serializeUpdateObject(createBooking))

        fetch( config.apiRoot + "booking/create/?" + this.serializeUpdateObject(createBooking) )
            .then(resp => resp.json())
            .then(json => {
                // show success message to the user
                console.log("API response:", json);
            })
            .catch(error => {
                // show error message to the user (validation is handles by the api/model)
                console.error("API error:", error);
            });
        // close modal
        //this.props.setState({editVehicle: false});

    };

    render() {
        if (!this.props.data.length) return null;
        return <section className="book-vehicle" onClick={this.props.closeBookModal}>

            <div className="book-vehicle-container">

                <div className="image-container-book">
                    {/*<img src={this.props.data[0].image || "http://via.placeholder.com/150x150"} alt="bild"/>*/}
                    <DayPicker
                        selectedDays={this.state.selectedDays}
                        disabledDays={this.state.disabledDays}
                        onDayClick={this.handleDayClick}
                    />
                </div>
                <div className="list-container">
                    <ul>
                        <li>{this.props.data[0].brand || 'Information saknas.'}</li>
                        <li>{this.props.data[0].model || 'Information saknas.'}</li>
                        <li>Årsmodell: {this.props.data[0].year || 'Information saknas.'}</li>
                        <li>Fordonstyp: {this.props.data[0].type || 'Information saknas.'}</li>
                        <li>Körkortkrav: {this.props.data[0].license || 'Information saknas.'}</li>
                        <li>Växellåda: {this.props.data[0].gearbox || 'Information saknas.'}</li>
                        <li>Dagshyra: {this.props.data[0].price || 'Information saknas.'}</li>
                        <li>Anteckningar: {this.props.data[0].notes || 'Inga anmärkningar.'}</li>
                        <li>datepicker här sen</li>
                    </ul>
                </div>
                <div className="button-container">
                    <button className="button" onClick={this.handleSubmit}>Boka</button>
                    <button className="button" onClick={this.props.closeBookModal}>Stäng</button>
                </div>
            </div>
        </section>;
    }
}

Date.prototype.addDays = function(days) { // TODO: no extend native
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

BookVehicle.propTypes = {
    data: PropTypes.array.isRequired,
};

