<h1 class="nombre-pagina">Reestablecer Password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email a continuacion</p>

<?php
    include_once __DIR__ . '/../templates/alertas.php';
?>

<form method="POST" class="formulario">

    <div class="campo">
        <label for="email">E-mail</label>
        <input type="email" id="email" placeholder="Tu E-mail" name="email"/>
    </div>

    <input type="submit" class="boton" value="Enviar instrucciones"/>
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesion</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear una</a>
</div>