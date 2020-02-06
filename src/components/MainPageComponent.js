import React, { Component } from 'react';

class MainPageComponent extends Component{

    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            predictions: [],
        };
        this.handleInputTextChange = this.handleInputTextChange.bind(this);
    }

    handleInputTextChange(event) {
        this.setState({inputText: event.target.value});
    }

    setPredictions = (data) => {
        this.setState({
            predictions: data
        });
    };

    generateText() {
        var input = this.state.inputText;
        var url = 'http://169.60.115.39:8888/predict';
        var params = {
            prefix: input,
        };

        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(params), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => response.json())
            .then(response => this.setPredictions(response.data))
    }

    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="mt-5">Sign in to create your own models</h1>
                        <p className="lead">Some more info here</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                            <label form="formControlTextarea1">Text area label</label>
                            <textarea className="form-control" id="formControlTextarea1" rows="3" onChange={this.handleInputTextChange}/>
                            <button id="generateText" type="button" className="btn btn-dark" onClick={() => this.generateText()}>Generate text</button>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="prediction-list-holder">
                            <ul className="prediction-list">
                                <li className="prediction-list-item" id="predictionItem0">{this.state.predictions[0]}</li>
                                <li className="prediction-list-item" id="predictionItem1">{this.state.predictions[1]}</li>
                                <li className="prediction-list-item" id="predictionItem2">{this.state.predictions[2]}</li>
                                <li className="prediction-list-item" id="predictionItem3">{this.state.predictions[3]}</li>
                                <li className="prediction-list-item" id="predictionItem4">{this.state.predictions[4]}</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default MainPageComponent;