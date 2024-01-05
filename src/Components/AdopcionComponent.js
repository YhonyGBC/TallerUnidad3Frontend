// IMPORT
import React, {useEffect, useState} from "react";
import axios from "axios";
import { Card, Button, Navbar, Container, Image, Modal, Form } from "react-bootstrap";
import Swal from 'sweetalert2';

// CUERPO COMPONENTE
const AdopcionComponent=()=>{
    // Definición de la URL de la API para obtener información de mascotas
    const urlMascotas = "http://localhost:8000/mascotas";

    // Estado para almacenar la lista de mascotas obtenidas de la API
    const [mascotas, setMascotas] = useState([]);

    // Estado para gestionar la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const mascotasPorPagina = 3;

    // Estado para almacenar la mascota seleccionada para mostrar detalles
    const [selectedMascota, setSelectedMascota] = useState(null);

    // Estado y funciones relacionadas con los modales de detalles y adopción
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAdoptModal, setShowAdoptModal] = useState(false);
    
    // Estado para almacenar los datos del solicitante en el formulario de adopción
    const [solicitante, setSolicitante] = useState({
      nombre_solicitante: "",
      correo_solicitante: "",
      telefono_solicitante: "",
    });

    // Efecto de carga inicial para obtener las mascotas al renderizar el componente
    useEffect(()=>{
        getMascotas();
    },[]);

    // Función para obtener las mascotas desde la API
    const getMascotas = async () => {
        const respuesta = await axios.get(`${urlMascotas}/buscar`);
        setMascotas(respuesta.data.mascotas);
    }

    // Función para mostrar los detalles de una mascota seleccionada
    const showDetails = (mascota) => {
        setSelectedMascota(mascota);
        setShowDetailsModal(true);
    };

    // Función para limpiar el formulario de adopción
    const clearForm = () => {
        setSolicitante({
          nombre_solicitante: "",
          correo_solicitante: "",
          telefono_solicitante: "",
        });
    };

    // Función para mostrar el formulario de adopción y limpiar el formulario cada vez que se entre a este
    const showAdoptForm = (mascota) => {
        setSelectedMascota(mascota);
        setShowAdoptModal(true);
        clearForm();
    };
    
    // Función para cerrar todos los modales y limpiar los estados relacionados
    const closeModal = () => {
        setSelectedMascota(null);
        setShowDetailsModal(false);
        setShowAdoptModal(false);
    };

    // Función llamada cada vez que se cambia un campo en el formulario de adopción
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSolicitante({ ...solicitante, [name]: value });
    };

    // Función para enviar el formulario de adopción (se utiliza a modo de prueba)
    const submitAdoptionForm = (e) => {
        e.preventDefault();

        console.log("Solicitud enviada:", solicitante, selectedMascota);

        // Muestra una alerta después de enviar la solicitud
        Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada!'
        });

        closeModal();
    };

    // Se calculan los índices de las mascotas en la página actual
    const indexOfLastMascota = currentPage * mascotasPorPagina;
    const indexOfFirstMascota = indexOfLastMascota - mascotasPorPagina;
    const mascotasPaginadas = mascotas.slice(indexOfFirstMascota, indexOfLastMascota);

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {/* Navbar con el nombre de la asociación y el logo */}
            <Navbar bg="light" variant="light">
                <Container className="d-flex justify-content-center align-items-center">
                <Navbar.Brand className="d-flex align-items-center">
                    <Image
                    src="imagenes/logo_lascan.png" 
                    alt="Logo"
                    width="100"
                    height="100"
                    className="d-inline-block align-top"
                    />
                    <div className="ms-2 fw-bold custom-text">LASCAN</div>
                </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Listado de Mascotas */}
            <div className="container">
                <div className="row mt-3">
                    {mascotasPaginadas.map((mascota) => (
                        <div key={mascota.id} className="col-md-4 mb-4">
                            <Card>
                                <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/imagenes/${mascota.foto}`} alt={mascota.nombre} />
                                <Card.Body>
                                    <Card.Title>Nombre: {mascota.nombre}</Card.Title>
                                    <Card.Subtitle>Raza: {mascota.raza}</Card.Subtitle>
                                    <Card.Text>{mascota.descripcion}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => showDetails(mascota)}>
                                        Detalles
                                    </Button>
                                    <Button 
                                        className="ms-2"
                                        variant="success"
                                        onClick={() => showAdoptForm(mascota)}>
                                        Adoptar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
                
                {/* Paginación */}
                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    {Array.from({ length: Math.ceil(mascotas.length / mascotasPorPagina) }, (_, i) => (
                    <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "primary" : "secondary"}
                        onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </Button>
                    ))}
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(mascotas.length / mascotasPorPagina)}>
                        Siguiente
                    </Button>
                </div>
                
                {/* Detalles Modal */}
                <Modal show={showDetailsModal} onHide={closeModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedMascota?.nombre} ({selectedMascota?.raza})</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{selectedMascota?.detalle}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                        Regresar
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                {/* Formulario de Adopción Modal */}
                <Modal show={showAdoptModal} onHide={closeModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Formulario de Adopción</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitAdoptionForm}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="Ingrese su nombre"
                                name="nombre_solicitante"
                                value={solicitante.nombre_solicitante}
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCorreo">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                type="email"
                                placeholder="Ingrese su correo"
                                name="correo_solicitante"
                                value={solicitante.correo_solicitante}
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTelefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                type="tel"
                                placeholder="Ingrese su teléfono"
                                name="telefono_solicitante"
                                value={solicitante.telefono_solicitante}
                                onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Enviar Solicitud
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

//EXPORT
export default AdopcionComponent;