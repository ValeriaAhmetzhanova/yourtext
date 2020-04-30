import React, { Component } from "react";
import {
    Table,
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card, Form, Modal,
    ProgressBar, Spinner,
} from "react-bootstrap";


// var CanvasJSReact = require('./canvasjs.react');
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;
// import CanvasJSReact from './canvasjs.react'

import { Line } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};


class Chart extends Component {

    

    constructor(props) {
        super(props);

        this.state = {
            show: true,
            title: props.title,
            datapoints: this.transformDataPoints(props.datapoints)
        }
        
        // this.toggleChart = this.toggleChart.bind(this)
        // setTimeout(this.toggleChart, 100);
    }

    toggleChart() {
        this.setState({
            show: true
        });
    }

    transformDataPoints(datapoints) {

        var labels = [];
        var datasets = [
            {
                label: 'Loss',
                fill: true,
                lineTension: 0.0,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
                data: []
            }
        ];

        for (var i=0; i<datapoints.length; i++) {
            labels.push(datapoints[i][1]);
            datasets[0].data.push(datapoints[i][0])
        }

        // return datapoints.map((point) => {
        //     return {x: point[1], y: point[0]};
        // });

        return { labels: labels, datasets: datasets }
    }

    render() {

        var chart = null;

        if (this.state.show) {
            // const options = {
            //     theme: "light2", // "light1", "dark1", "dark2"
            //     animationEnabled: true,
            //     zoomEnabled: true,
            //     title: {
            //         text: this.state.title
            //     },
            //     axisY: {
            //         includeZero: false
            //     },
            //     data: [{
            //         type: "area",
            //         dataPoints: this.state.datapoints
            //     }]
            // }

            chart = <Line data={this.state.datapoints} />;//<CanvasJSReact.CanvasJSChart options={options} />
        }

        

        return (
            <div>
                {chart}
            </div>
        );
    }
}


class EventView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: props.events
        };
    }

    render () {
        const events = this.state.events.map((event, index) => {
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{event.message}</td>
                    <td>{event.requested_by}</td>
                    <td>{event.timestamp}</td>
                </tr>
            );
        });

        return (
            <Table striped borderless size="sm" variant="light">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Message</th>
                        <th>Requestor</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {events}
                </tbody>
            </Table>
        );
    }
}

class ModelDetails extends Component {
    constructor(props) {

        super(props);

        this.state = {
            show: props.show,
            onHide: props.onHide,
            model: props.model
        };

        console.log(this.state.model);
    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })

        this.state.onHide(this.state.show);
    }


    render() {

        let modalFooter = null;

        return (
            <Modal
                show={true}
                onHide={() => this.toggleModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="contained-modal-title-vcenter">
                        Edit {this.state.dataset.meta.title} dataset
                    </Modal.Title> */}
                </Modal.Header>
                
                <Modal.Body>
                    <Modal.Title>Params</Modal.Title>
                    <br></br>
                    <Modal.Title>Stats</Modal.Title>
                    <Chart 
                        title={"Loss"}
                        datapoints={this.state.model.progress.stats.loss}/>
                    <br></br>
                    <Modal.Title>Events</Modal.Title>
                    <EventView
                        events={this.state.model.progress.events} />
                </Modal.Body>

                {modalFooter}
                
                
            </Modal>
        );
    }
}

export default ModelDetails;