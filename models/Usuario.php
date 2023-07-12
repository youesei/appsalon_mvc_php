<?php 

namespace Models;

use Models\ActiveRecord;

class Usuario extends ActiveRecord{

    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    public function __construct($args = [])
    {
        $this->id          = $args['id'] ?? NULL;
        $this->nombre      = $args['nombre'] ?? '';
        $this->apellido    = $args['apellido'] ?? '';
        $this->email       = $args['email'] ?? '';
        $this->password    = $args['password'] ?? '';
        $this->telefono    = $args['telefono'] ?? '';
        $this->admin       = $args['admin'] ?? '0';
        $this->confirmado  = $args['confirmado'] ?? '0';
        $this->token       = $args['token'] ?? '';
    }


    public function validarNuevaCuenta(){
        if (!trim($this->nombre)) {
            self::$alertas['error'][] = 'El nombre es obligatorio';
        }

        if (!trim($this->apellido)) {
            self::$alertas['error'][] = 'El apellido es obligatorio';
        }

        if (!trim($this->email)) {
            self::$alertas['error'][] = 'El email es obligatorio';
        }

        if (!trim($this->password)) {
            self::$alertas['error'][] = 'El password es obligatorio';
        }

        if (strlen(trim($this->password)) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }

        return self::$alertas;
    }

    public function existeUsuario(){
        $query = "SELECT * FROM ". self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";

        $resultado = self::$db->query($query);

        if ($resultado->num_rows) {
            self::$alertas['error'][] = 'El usuario ya esta registrado';
        }

        return $resultado;
    }

    public function hashPassword(){
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken(){
        $this->token = uniqid();
    }

    public function validarLogin(){
        if(!trim($this->email)){
            self::$alertas['error'][] = 'El Email es obligatorio';
        }

        if(!trim($this->password)){
            self::$alertas['error'][] = 'El Password es obligatorio';
        }

        return self::$alertas;
    }

    public function comprobarPasswordAndVerificado($password){
        $resultado = password_verify($password, $this->password);

        // debuguear($resultado);

        if (!$resultado || !$this->confirmado) {
            self::$alertas['error'][] = 'Password Incorrecto o tu cuenta no ha sido confirmada';
        } else {
            return true;
        }
    }

    public function validarEmail(){
        if(!trim($this->email)){
            self::$alertas['error'][] = 'El Email es obligatorio';
        }

        return self::$alertas;
    }

    public function validarPassword(){
        if (!trim($this->password)) {
            self::$alertas['error'][] = 'El password es obligatorio';
        }

        if (strlen(trim($this->password)) < 6) {
            self::$alertas['error'][] = 'El password debe contener al menos 6 caracteres';
        }

        return self::$alertas;
    }

}