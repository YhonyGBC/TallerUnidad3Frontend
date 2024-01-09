// IMPORT
import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import { Card, Button, Navbar, Container, Image, Modal, Form } from "react-bootstrap";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// CUERPO COMPONENTE
const AdopcionComponent=()=>{
    // Definición de la URL de la API para obtener información de mascotas
    const urlMascotas = "http://localhost:8000/mascotas";

    // Definición de la URL de la API para obtener información de administradores
    const urlAdministradores = "http://localhost:8000/administradores";

    // Estado para almacenar la lista de mascotas obtenidas de la API
    const [mascotas, setMascotas] = useState([]);

    // Estado para almacenar la lista de administradores obtenidos de la API
    const [administradores, setAdministradores] = useState([]);

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

    /*  
        searchTerm es el estado que almacena el término de búsqueda actual.
        setSearchTerm es la función que se utiliza para actualizar el valor de searchTerm.
    */
    const [searchTerm, setSearchTerm] = useState("");

    /*
        Estado para controlar la visibilidad del modal de inicio de sesión de administrador.
    */
    const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

    /*
        Estado para almacenar las credenciales de administrador (nombre de usuario y contraseña).
    */
    const [adminCredentials, setAdminCredentials] = useState({
        username: "",
        password: "",
    });

    /*
        Estado para comprobar si el administrador ha iniciado sesión o no.
    */
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    /*
        Estado para controlar la visibilidad del modal de edición de mascotas.
    */
    const [showEditModal, setShowEditModal] = useState(false);

    /*
        Estado para almacenar los datos del formulario de mascotas, que se utilizan al agregar o editar una mascota.
    */
    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        raza: "",
        edad: "",
        descripcion: "",
        detalle: "",
        foto: "",
    });

    /*
        Estado para determinar si el formulario está en modo de edición o no.
    */
    const [editMode, setEditMode] = useState(false);


    /*
        Función que se llama al abrir el modal de edición de mascotas.
        Recibe la información de una mascota y actualiza el estado del formulario con esos datos.
        Establece el modo de edición en verdadero y muestra el modal de edición.
    */
    const openEditModal = (mascota) => {
        setEditMode(true);  
        setFormData({
            id: mascota.id,
            nombre: mascota.nombre,
            tipo: mascota.tipo,
            raza: mascota.raza,
            edad: mascota.edad,
            descripcion: mascota.descripcion,
            detalle: mascota.detalle,
            foto: mascota.foto,
        });
        setShowEditModal(true);
    };

    /*
        useCallback es un gancho de React que memoriza una función para evitar que se vuelva a crear en cada renderizado, a 
        menos que sus dependencias cambien.
        La función getMascotas realiza una solicitud a la API para obtener la lista de mascotas.
        El array [searchTerm] en el segundo argumento de useCallback especifica que la función depende del valor de 
        searchTerm. Si searchTerm cambia, se creará una nueva versión de la función.
    */
    const getMascotas = useCallback(async () => {
        const respuesta = await axios.get(`${urlMascotas}/buscar`);
        const mascotasFiltradas = respuesta.data.mascotas.filter(
            (mascota) =>
                mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mascota.raza.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMascotas(mascotasFiltradas);
    }, [searchTerm]);

    /*
        Función para obtener la lista de administradores desde el servidor.
        La respuesta se almacena en la variable 'respuesta'.
        Actualiza el estado 'administradores' con la lista de administradores obtenida del servidor.
    */
    const getAdministradores = async () => {
        const respuesta = await axios.get(`${urlAdministradores}/buscar`);
        setAdministradores(respuesta.data.administradores);
    };

    /* 
        Efecto de carga inicial para obtener las mascotas al renderizar el componente
        Este efecto se dispara cada vez que getMascotas cambia. En este caso, solo cambia si searchTerm cambia.
    */
    useEffect(()=>{
        getMascotas();
    }, [getMascotas]);

    /* 
        Efecto de carga para obtener los administradores al renderizar el componente
        Este efecto se dispara una vez debido al array de dependencias vacío ([]).
    */
    useEffect(()=>{
        getAdministradores();
    }, []);

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

    /*
        handleSearch es una función que se ejecuta cuando el valor del campo de búsqueda cambia.
        Actualiza el estado searchTerm con el nuevo valor del campo de búsqueda.
    */
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    /*
        Función para mostrar el modal de inicio de sesión de administrador.
    */
    const handleAdminLogin = () => {
        setShowAdminLoginModal(true);
    };
    
    /*
        Función para cerrar el modal de inicio de sesión de administrador.
    */
    const closeAdminLoginModal = () => {
        setShowAdminLoginModal(false);
    };

    /*
        Función para manejar los cambios en los campos de entrada del inicio de sesión de administrador.
        Actualiza el estado de las credenciales de administrador.
    */
    const handleAdminLoginInputChange = (e) => {
        const { name, value } = e.target;
        setAdminCredentials({ ...adminCredentials, [name]: value });
    };

    /*
        Función que verifica las credenciales y muestra mensajes de éxito o error utilizando la librería Swal.
        Actualiza el estado de inicio de sesión de administrador (esto para poder visualizar o no las funcionalidades
        de añair, editar y eliminar mascotas).
        Cierra el modal de inicio de sesión independientemente del resultado.
    */
    const handleAdminLoginSubmit = async (e) => {
        e.preventDefault();
        const administradorValido = administradores.find(
            (admin) => admin.username === adminCredentials.username && admin.password === adminCredentials.password
        );

        if (administradorValido) {
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso!',
                showCancelButton: false,
                showConfirmButton: true,
            });

            setIsAdminLoggedIn(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Inicio de sesión fallido!',
                showCancelButton: false,
                showConfirmButton: true,
            });

            setIsAdminLoggedIn(false);
        }

        closeAdminLoginModal();
    }; 
    
    // Función para enviar el formulario de adopción (se utiliza a modo de prueba)
    const submitAdoptionForm = (e) => {
        e.preventDefault();

        console.log("Solicitud enviada:", solicitante, selectedMascota);

        Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada!'
        });

        closeModal();
    };

    // Función para manejar la eliminación de una mascota
    const handleDeleteMascota = async (mascotaId) => {
        try {
            await axios.delete(`${urlMascotas}/eliminar/${mascotaId}`);

            getMascotas();

            Swal.fire({
                icon: 'success',
                title: 'Mascota eliminada exitosamente!'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar la mascota!',
                text: 'Por favor, inténtalo de nuevo.'
            });
        }
    };

    /*
        Función para manejar los cambios en los campos de entrada del formulario de mascotas.
        Convierte el valor de 'edad' a un número entero si el campo es 'edad'.
        Actualiza el estado del formulario de mascotas.
    */
    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        const valorParseado = name === 'edad' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: valorParseado });
    };

    /*
        Función para cerrar el modal de edición de mascotas.
    */
    const closeEditModal = () => {
        setShowEditModal(false);
    };
    
    /*
        Función que actualiza la lista de mascotas después de una adición exitosa.
    */
    const submitAddForm = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post(`${urlMascotas}/crear`, formData);
    
            getMascotas();
    
            Swal.fire({
                icon: 'success',
                title: 'Mascota añadida exitosamente!'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al añadir la mascota!',
                text: 'Por favor, inténtalo de nuevo.'
            });
        }
        closeEditModal();
    };

    /*
        Función que actualiza la lista de mascotas después de una edición exitosa.
    */
    const submitEditForm = async (e) => {
        e.preventDefault();
    
        try {
            await axios.put(`${urlMascotas}/actualizar/${formData.id}`, formData);

            getMascotas();

            Swal.fire({
                icon: 'success',
                title: 'Mascota editada exitosamente!'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al editar la mascota!',
                text: 'Por favor, inténtalo de nuevo.'
            });
        }
        closeEditModal();
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
                <Navbar.Collapse className="justify-content-end">
                    <FontAwesomeIcon icon={faUser} size="2x" onClick={() => handleAdminLogin()} style={{ cursor: 'pointer' }}/>
                </Navbar.Collapse>
            </Navbar>

            {/* Campo de búsqueda */}
            <Form.Control
                type="text"
                placeholder="Buscar por nombre o raza"
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Botón para añadir mascota visible solo para administradores */}
            <div className="d-flex justify-content-center mt-3">
                {isAdminLoggedIn && (
                    <Button variant="secondary" onClick={() => { setEditMode(false); setFormData({}); setShowEditModal(true); }}>
                        Añadir Mascota
                    </Button>
                )}
            </div>

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
                                    {isAdminLoggedIn && (
                                        <div>
                                            <Button variant="warning" className="mt-2" onClick={() => {openEditModal(mascota);}}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" className="mt-2 ms-2" onClick={() => handleDeleteMascota(mascota.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    )}
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

                {/* Login Administrador Modal */}
                <Modal show={showAdminLoginModal} onHide={closeAdminLoginModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Iniciar Sesión - Administrador</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Nombre de Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su nombre de usuario"
                                    name="username"
                                    value={adminCredentials.username}
                                    onChange={handleAdminLoginInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    name="password"
                                    value={adminCredentials.password}
                                    onChange={handleAdminLoginInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={handleAdminLoginSubmit}>
                                Iniciar Sesión
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                
                {/* Adición y Edición de Mascotas Modal */}
                <Modal show={showEditModal} onHide={closeEditModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? "Editar Mascota" : "Añadir Mascota"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editMode ? submitEditForm : submitAddForm}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    name="nombre"
                                    value={formData.nombre || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTipo">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleFormInputChange}
                                >
                                    <option value="">---</option>
                                    <option value="Perro">Perro</option>
                                    <option value="Gato">Gato</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formRaza">
                                <Form.Label>Raza</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la raza"
                                    name="raza"
                                    value={formData.raza || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEdad">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la edad"
                                    name="edad"
                                    value={formData.edad || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDescripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="textarea"
                                    placeholder="Ingrese la descripción corta"
                                    name="descripcion"
                                    value={formData.descripcion || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDetalle">
                                <Form.Label>Detalle</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ingrese el detalle"
                                    name="detalle"
                                    value={formData.detalle || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formFoto">
                                <Form.Label>Foto</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese la foto"
                                    name="foto"
                                    value={formData.foto || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

//EXPORT
export default AdopcionComponent;