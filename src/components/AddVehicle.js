import config from '../config.json';
import React, {Component} from 'react';

export default class AddVehicle extends Component {
    constructor() {
        super(...arguments);
        this.state = { // data for testing
            type: 'personbil',
            license: 'B',
            brand: 'Olssons',
            model: 'Modell 123',
            year: 2017,
            gearbox: 'manuell',
            price: 999,
            note: 'Förifylld exempeldata i formuläret.'
        };
    }

    serializeObject = (obj) => Object.keys(obj).map(
        prop => encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop])
    ).join('&');


    handleChange = (event) => {
        const {id, value} = event.target;
        this.setState({[id]: value});
    };

    handleSubmit = () => {
        fetch(config.apiRoot + "vehicle/create?" + this.serializeObject(this.state))
            .then(resp => resp.json())
            .then(json =>
            {
                console.log("API response:", json);
                this.props.handleSuccessMessage(json);

                if (json.result === 'ok') {
                    // close modal
                    this.props.setState({ addVehicle: false });

                    // uppdate global state
                    let updatedDatabase = [json.data, ...this.props.getState.database];
                    this.props.setState({database: updatedDatabase});
                }
            })
            .catch(error => {
                // show error message to the user (validation is handles by the api/model)
                console.error("API error:", error);
                this.props.handleErrorMessage(error.message);
            });
    };

    render() {
        if (this.props.if) {
            return <section className="add-vehicle" onClick={this.props.handleAddVehicleModal}>
                <div className="add-vehicle-container">
                    <h1 className="section-heading">Lägg till ett fordon</h1>

                    <form action="">
                        <div className="form-group-container">
                            <label htmlFor="type">Fordonstyp</label>
                            <input type="text" placeholder="Personbil" id="type" onChange={this.handleChange}
                                   value={this.state.type || ""}/>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="license">Körkort</label>
                            <select id="license" onChange={this.handleChange} value={this.state.license || ""}>
                                <option value="" disabled>Välj</option>
                                <option value="A">A</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="AM">AM</option>
                                <option value="B">B</option>
                                <option value="BE">BE</option>
                                <option value="C">C</option>
                                <option value="CE">CE</option>
                                <option value="C1">C1</option>
                                <option value="C1E">C1E</option>
                                <option value="D">D</option>
                                <option value="D1E">D1E</option>
                            </select>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="brand">Märke</label>
                            <input type="text" placeholder="Mazda" id="brand" onChange={this.handleChange}
                                   value={this.state.brand || ""}/>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="model">Modell</label>
                            <input type="text"
                                   placeholder="321i"
                                   id="model"
                                   onChange={this.handleChange}
                                   value={this.state.model || ""}/>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="year">År</label>
                            <input type="text" placeholder="1995" id="year" onChange={this.handleChange}
                                   value={this.state.year || ""}/>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="gearbox">Växellåda</label>
                            <select id="gearbox" onChange={this.handleChange} value={this.state.gearbox || ""}>
                                <option value="" disabled>Välj</option>
                                <option value="manuell">Manuell</option>
                                <option value="automat">Automat</option>
                            </select>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="price">Dagshyra</label>
                            <input type="text" placeholder="999" id="price" onChange={this.handleChange}
                                   value={this.state.price || ""}/>
                        </div>

                        <div className="form-group-container">
                            <label htmlFor="fuel">Drivmedel</label>
                            <select id="fuel" onChange={this.handleChange} value={this.state.fuel || ""}>
                                <option value="" disabled>Välj</option>
                                <option value="95">95</option>
                                <option value="E85">E85</option>
                                <option value="diesel">diesel</option>
                                <option value="gas">gas</option>
                                <option value="jetbränsle">jetbränsle</option>
                            </select>
                        </div>

                        <div className="form-group-container-full">
                            <label htmlFor="image">Bildlänk</label>
                            <input type="text" placeholder="http://example.com" id="image" onChange={this.handleChange}
                                   value={this.state.image || ""}/>
                        </div>

                        <div className="form-group-container-full">
                            <label htmlFor="note" className="block">Noteringar</label>
                            <textarea placeholder="Bilen är nästan trasig." id="note" onChange={this.handleChange}
                                      value={this.state.note || ""}/>
                            <div className="button-container">
                                <div className="form-group-container-full">
                                    <button className="button" type="button" onClick={this.handleSubmit}>Lägg till</button>
                                </div>
                                <div className="form-group-container-full">
                                    <button className="button button-close" type="button" onClick={this.props.handleAddVehicleModal}>Stäng</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </section>;
        } else {
            return null;
        }
    }
}

