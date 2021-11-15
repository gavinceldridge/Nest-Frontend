//React functional component that renders a timer with hours and minutes from a Bootstrap dropdown.
import React from 'react'
import { DropdownButton, Dropdown, Button } from 'react-bootstrap'
export default function Timer() {
    return (
        <div>
            {/* UI which renders a bootstrap selector to choose an hour and minute */}
            <DropdownButton id="dropdown-basic-button" title="Select Time">
                <Dropdown.Item>1 Hour</Dropdown.Item>
                <Dropdown.Item>2 Hours</Dropdown.Item>
            </DropdownButton>
        </div>
    )
}


