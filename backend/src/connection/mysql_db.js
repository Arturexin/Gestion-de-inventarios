import { createPool } from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../config.js';

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
    
    /* dateStrings: true, */// Esta línea vovierte las fechas a string, no recomendado obvia UTC
    timezone: 'Z' // <-- fuerza a tratar todo como UTC
})

try {
  const connection = await pool.getConnection();
  console.log(`✅ Conectado a MySQL en puerto ${DB_PORT}`);
  connection.release(); // Importante: liberar conexión
} catch (error) {
  console.error('❌ Error al conectar a MySQL:', error);
}