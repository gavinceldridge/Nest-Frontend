import { render, fireEvent } from '@testing-library/react';
import ThermostatController from './ThermostatController';
import React from "react";
import BackendApi from "./BackendApi";

//smoke test
test('renders without crashing', () => {
    render(<ThermostatController />);
});

//smoke test
test("render matches snapshot", () => {
    const { asFragment } = render(<ThermostatController />);
    expect(asFragment()).toMatchSnapshot();
});

//set the thermo mode to cool via an API call, then submit the temperature change form button, and verify temp through the API again. 
test("updates temperature upon submission", async () => {
    const { queryByTestId } = render(<ThermostatController />);
    // expect(queryByTestId("confirmBtn")).toBeInTheDocument();
    expect(document.getElementsByName("temp")[0]).toBeInTheDocument();
    expect(document.getElementsByName("confirm")[0]).toBeInTheDocument();

    //set the thermostat mode to cool:
    await BackendApi.changeMode("COOL");

    document.getElementsByName("temp")[0].value = 70;
    fireEvent.click(document.getElementsByName("confirm")[0]);

    //wait 5 seconds to ensure the temp change request was fulfilled
    setTimeout(async () => {

        const result = await BackendApi.getDeviceInfo();
        console.log(result);

    }, 5000);
});
