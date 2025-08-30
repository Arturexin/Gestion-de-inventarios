import { pool } from '../connection/mysql_db.js';

export const getCategories = async (req, res) => {
    const id_user_int = req.user.id || 1
    try {
        const [rows] = await pool.query(
            'SELECT id, name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, date_record, state ' +
            'FROM categories ' +
            'WHERE state = 1 AND id_user = ?',
            [ id_user_int ]
        )
        res.status(200).json({
            status: 'success',
            message: 'Categorías obtenidas correctamente',
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'No se han podido obtener las categorías',
        })
    }
};

export const createCategory = async (req, res) => {
    const id_user_int = req.user.id || 1
    const { name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, date_record } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO categories (name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, id_user, date_record, state) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, id_user_int, date_record, 1 ]
        )

        const [row] = await pool.query(
            'SELECT id, name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, id_user, date_record, state ' +
            'FROM categories ' +
            'WHERE state = 1 AND id_user = ?',
            [ id_user_int ]
        )
        if (!row.length) {
            return res.status(404).json({
                status: 'error',
                message: 'Categoría no guardada.'
            });
        }
        res.status(201).json({
            id: result.insertId,
            row
        })

    } catch (errror) {
        return res.status(500).json({
            status: 'error',
            message: 'No se ha podido crear la categoría.',
        })
    }
};

export const updateCategory = async (req, res) => {
    const id_user_int = req.user.id || 1
    const { id } = req.params;
    const { name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11 } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE categories SET ' +
            'name = IFNULL(?, name), ' +
            'extent = IFNULL(?, extent), ' +
            'c_0 = IFNULL(?, c_0), ' +
            'c_1 = IFNULL(?, c_1), ' +
            'c_2 = IFNULL(?, c_2), ' +
            'c_3 = IFNULL(?, c_3), ' +
            'c_4 = IFNULL(?, c_4), ' +
            'c_5 = IFNULL(?, c_5), ' +
            'c_6 = IFNULL(?, c_6), ' +
            'c_7 = IFNULL(?, c_7), ' +
            'c_8 = IFNULL(?, c_8), ' +
            'c_9 = IFNULL(?, c_9), ' +
            'c_10 = IFNULL(?, c_10), ' +
            'c_11 = IFNULL(?, c_11), ' + 
            'WHERE state = 1 AND id = ? AND id_user = ?',
            [ name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, id, id_user_int ]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Categoría no encontrada o no actualizada.'
            });
        }
        const [row] = await pool.query(
            'SELECT id, name, extent, c_0, c_1, c_2, c_3, c_4, c_5, c_6, c_7, c_8, c_9, c_10, c_11, date_record, state ' +
            'FROM categories ' +
            'WHERE state = 1 AND id = ? AND id_user = ?',
            [ id, id_user_int ] // Aquí usas el id del usuario del token
        )
        res.status(200).json({
            status: 'success',
            message: `La categoría ${row[0].name} fue actualizada correctamente.`,
            data: row[0]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'No se ha podido actualizar la categoría.',
        })
    }
};

export const deleteCategory = async (req, res) => {
    const id_user_int = req.user.id || 1
    const { id } = req.params;

    try {
        const [result] = await pool.query(
            'UPDATE categories SET state = 0 WHERE state = 1 AND id = ? AND id_user = ?',
            [ id, id_user_int]
        )
        if(result.affectedRows === 0){
            return res.status(404).json({
                status: 'error',
                message: 'Categoría no encontrada o no eliminada.'
            });
        }
        res.status(500).json({ 
            status: 'success', 
            message: 'Categoría eliminada correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'No se ha podido eliminar la categoría.',
        })
    }
}