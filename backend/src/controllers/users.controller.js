import { pool } from '../connection/mysql_db.js';

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, last_name, username, email, phone, password, ruc, direccion, moneda, web, date_record, state ' +
            'FROM users ' +
            'WHERE state = 1' 
        )
        console.log([rows]);
        res.status(200).json({
            status: 'success',
            message: 'Usuarios obtenidos correctamente.',
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'No se pueden obtener los usuarios. | ' + error,
        })
    }
} 

export const createUser = async (req, res) => {
  const { name, last_name, username, email, phone, password, ruc, direccion, moneda, web, date_record, state } = req.body

  try {
    const [result] = await pool.query(
      `INSERT INTO users 
        (name, last_name, username, email, phone, password, ruc, direccion, moneda, web, date_record, state) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, last_name, username, email, phone, password, ruc, direccion, moneda, web, date_record, state]
    )

    res.status(201).json({
      status: 'success',
      message: `El usuario ${name} ${last_name} ha sido creado correctamente. Usuario de acceso: ${username}`,
      data: {
        id: result.insertId,
        name,
        last_name,
        username
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'No se puede crear el usuario. | ' + error,
    })
  }
}