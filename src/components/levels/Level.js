import React from 'react';
import { Badge } from 'react-bootstrap';

export default function Level({ level }) {
  return (
    <Badge bg="primary" text="light">
      Level {level}
    </Badge>
  );
}
