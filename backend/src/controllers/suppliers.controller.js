import { pool } from '../connection/mysql_db.js'

export const getSuppliers = async (req, res) => { 
    const id_user_int = req.user.id || 1 
    try { 
        const [rows] = await pool.query( 
            'SELECT name, doc, email, phone, address, date_record ' + 
            'FROM suppliers ' + 
            'WHERE state = 1 AND id_user = ?', 
            [ id_user_int ] 
        ) 
        res.status(500).json({
            status: 'success',
            message: 'Proveedores obtenidos correctamente',
            data: rows
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Proveedores no encontrados.'
        })
    }
}

export const createSupplier = async (req, res) => {
    const id_user_int = req.user.id || 1 
    const { name, doc, email, phone, address, date_record } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO suppliers (name, doc, email, phone, address, id_user, date_record, state) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ name, doc, email, phone, address, id_user_int, date_record, 1 ]
        )

    } catch (error) {
        return req.status(500).json({
            status: 'error',
            message: 'Proveedor no creado.'
        })
    }
}