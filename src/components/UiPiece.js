import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

import ModeSelector from './ModeSelector';

export default function UiPiece({ formChangeHandler, formData }) {
    return (
        <Form.Group as={Row} id="mode">
            <Form.Label column sm={5}><h3>Mode</h3></Form.Label>
            <Col sm={6}>
                <ModeSelector formChangeHandler={formChangeHandler} formData={formData} />
            </Col>
        </Form.Group>
    )
}
