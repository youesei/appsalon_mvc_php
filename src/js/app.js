let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id:'',
    nombre:'',
    fecha: '',
    hora:'',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta la secciones
    tabs(); // Cambia la seccion cunado se presione los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de php
    
    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    // Oculta la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) seccionAnterior.classList.remove('mostrar');

    // Seleccionar la seccion con el paso.. 
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anteriro
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) tabAnterior.classList.remove('actual');

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion();

            botonesPaginador();
        })
    });
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso===1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    else if(paso===3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }
    
    else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    
    paginaAnterior.addEventListener('click', function() {
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

async function consultarAPI(){
    try {
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios( servicios ){
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = () => { seleccionarServicio(servicio) };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);
        
        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    if ( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo
       cita.servicios = servicios.filter( agregado => agregado.id !== id );
       divServicio.classList.remove('seleccionado');

    } else {
        // Agregarlo 
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');

    inputFecha.addEventListener('input', function({ target }) {
        
        const dia = new Date(target.value).getUTCDay();

        if ( [6, 0].includes(dia) ) {
            target.value = '';
            mostrarAlerta('Fines de semana no permitimos', 'error', '.formulario');
        } else {
            cita.fecha = target.value;
        }

    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', function ({ target }) {
        
        const horaCita = target.value;
        const hora = horaCita.split(":")[0];
        if ( hora < 10 || hora > 18 ) {
            target.value = '';
            mostrarAlerta('Hora No Valida', 'error', '.formulario');
        } else {
            cita.hora = target.value;
        }

    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece=true) {
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia){
        alertaPrevia.remove();
    }
    
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    
    const formulario = document.querySelector(elemento);
    formulario.appendChild(alerta);

    if (desaparece) {
        setTimeout(() => {
           alerta.remove(); 
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if ( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Formatesar el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heding para servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);
    
    // Iterando y mostrando los servicios
    servicios.forEach( servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);

    });

    // Heding para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);
    
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${formatearFecha(fecha)}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

function formatearFecha(fecha) {
    
    // Instanciamos un nuevo objeto con la fecha elegida
    const fechaObj = new Date(fecha);

    // Extraemos año mes dia
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    // Instanciamos nuevamente para formatear
    const fechaUTC = new Date( Date.UTC(year, mes, dia) );
    
    // Definimos las opciones para pasar a la funcion toLocalDateString
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // Formateamos la fecha
    const fechaFormateada = fechaUTC.toLocaleDateString('es-CO', opciones);

    return fechaFormateada;
}

async function reservarCita() {

    const { fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map( servicio => servicio.id );

    const datos = new FormData();

    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    try {
        // Peticion hacia la api
        const url = `${location.origin}/api/citas`;
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const { resultado } = await respuesta.json();

        console.log(resultado);

        if (resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            });
        }  
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita',
        });
    }

}