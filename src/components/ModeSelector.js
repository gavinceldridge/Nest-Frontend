import React from 'react'

import { Form } from 'react-bootstrap';

export default function ModeSelector({ formData, formChangeHandler }) {
    return (
        <Form.Control as="select" size="lg" name="mode" onChange={formChangeHandler} value={formData.mode} >
            {formData.modeOptions.map(val => <option key={val}>{val}</option>)}
        </Form.Control>
    );
}
