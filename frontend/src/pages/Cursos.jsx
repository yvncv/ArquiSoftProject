import React, { useContext, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Cursos = () => {
    const { login } = useContext(AuthContext);
    const [codigo, setCodigo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const navigate = useNavigate();
    
  
    return (
        <div>
            hola
        </div>
    );
  };
  
  export default Cursos;