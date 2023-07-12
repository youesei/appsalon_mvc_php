<h1 class="nombre-pagina">Reestablecer Password</h1>
<p class="descripcion-pagina">Coloca tu nuevo password a continuacion</p>

<?php
    include_once __DIR__ . '/../templates/alertas.php';
?>

<?php if ($error) return; ?>

<form method="POST" class="formulario">

    <div class="campo">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Tu Password" name="password"/>
    </div>

    <input type="submit" class="boton" value="Reestablecer"/>
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesion</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear una</a>
</div>