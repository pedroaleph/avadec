import { Button, Modal } from "react-bootstrap";

interface ModalConfirmProps {
    message?: string;
    show: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const ModalConfirm = ({ message, show, onConfirm, onClose }: ModalConfirmProps) => {
    const text = message ?? 'Deseja realmente realizar esta operação?';

    return (
        <Modal show={show} onHide={onClose} backdrop='static' style={{ top: '25%' }}>
            <Modal.Body className="text-center">{ text }</Modal.Body>
            <Modal.Footer className="justify-content-evenly">
            <Button className="text-uppercase w-25" variant="outline-primary" onClick={onConfirm}>
                sim
            </Button>
            <Button className="text-uppercase w-25" variant="outline-secondary" onClick={onClose}>
                não
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalConfirm;
