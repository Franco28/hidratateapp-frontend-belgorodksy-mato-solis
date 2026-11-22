export const META_INICIAL = 2000;
export const CLAVE_DATOS = "hidratate_tp2_datos_es";
export const CLAVE_SESION = "hidratate_tp2_sesion_es";

// Cuentas inventadas de datos iniciales para poder iniciar sesión sin registrarse, y probar la aplicación.
export const datosIniciales = {
  usuarios: [
    {
      id: "1",
      nombre: "Administrador",
      correo: "admin@hidratate.app",
      contrasena: "Admin123!",
      rol: "administrador",
      activo: true,
      meta: META_INICIAL,
      recordatorios: false,
      minutosRecordatorio: 60,
    },
    {
      id: "2",
      nombre: "Usuario de prueba",
      correo: "usuario@hidratate.app",
      contrasena: "Usuario123!",
      rol: "usuario",
      activo: true,
      meta: META_INICIAL,
      recordatorios: false,
      minutosRecordatorio: 60,
    },
  ],
  consumos: [],
};
