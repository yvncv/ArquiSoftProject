import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ConfirmDeleteModalProps {
    show: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
    obj: string;
}

const ModalEliminar: React.FC<ConfirmDeleteModalProps> = ({ show, handleClose, handleConfirm, obj }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación de <span color='red'>{obj}</span></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>¿Está seguro que desea eliminar este {obj}? Esta acción no se puede deshacer.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="danger" onClick={handleConfirm}>Eliminar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEliminar;