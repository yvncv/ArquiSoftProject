import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Accordion, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const Curso = () => {
    const location = useLocation();
    const { curso } = location.state || {};
    const [key, setKey] = useState('home');

    if (!curso) {
        return <div>Curso no encontrado</div>;
    }

    return (
        <>
            <div className="container-curso-seleccionado-total">
                <div className="nombre-curso">
                    <h1>{curso.nombre}</h1>
                </div>
                <Tabs
                    className="container-curso-seleccionado opciones-curso mb-3"
                    defaultActiveKey="curso"
                    id="uncontrolled-tab-example"
                >
                    <Tab className="opcion activo" eventKey="curso" title="Curso"  style={{height: 'fit-content'}}>
                        <div className="container-curso-seleccionado" >
                            <div className="seccion" >
                                <FontAwesomeIcon icon="chevron-right" size="1x" />
                                <h3>General</h3>
                            </div>
                            
                        </div>
                    </Tab>
                    <Tab className="opcion" eventKey="participantes" title="Participantes">
                        
                    </Tab>
                    <Tab className="opcion" eventKey="calificaciones" title="Calificaciones">
                        
                    </Tab>
                    <Tab className="opcion" eventKey="competencias" title="Competencias">

                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default Curso;
