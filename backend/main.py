from flask import Flask, blueprints, jsonify, render_template, send_from_directory, redirect, request, url_for, flash, session
import os
from flask_cors import CORS, cross_origin

from db_connection import init_app, mysql


import routes.entradas_routes as entradas_
import routes.salidas_routes as salidas_
import routes.ventas_routes as ventas_
import routes.clientes_routes as clientes_

import routes.productos_routes as productos_
import routes.sucursales_routes as sucursales_
import routes.categorias_routes as categorias_
import routes.numeracion_routes as numeracion_
import routes.transferencias_routes as transferecias_
import routes.despacho_routes as despacho_
import routes.usuarios_routes as usuarios_
import routes.creditos_routes as creditos_

app = Flask(__name__, static_folder='../frontend/public', template_folder='../frontend/public')

# app= Flask(__name__)

# Configuraciones de seguridad y CORS
app.secret_key ='hola_calichinski'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Inicialización de la base de datos MySQL
init_app(app)

# Inventarios
app.register_blueprint(productos_.productos_LS)
app.register_blueprint(productos_.productos_conteo)
app.register_blueprint(productos_.productos_tabla)
app.register_blueprint(productos_.productos_individual_stock_id)

# entradas
app.register_blueprint(entradas_.entradas_conteo)
app.register_blueprint(entradas_.entradas_tabla)
app.register_blueprint(entradas_.entradas_recompra_grupal_post)
app.register_blueprint(entradas_.procesar_devolucion_entradas_post)
app.register_blueprint(entradas_.entradas_compras_grupal_get_post)

# salidas
app.register_blueprint(salidas_.salidas_conteo)
app.register_blueprint(salidas_.salidas_tabla)
app.register_blueprint(salidas_.procesar_devolucion_salidas_post)
app.register_blueprint(salidas_.salidas_comprobante)
app.register_blueprint(salidas_.salidas_categorias_suc)
app.register_blueprint(salidas_.salidas_productos_sucursal_grupo)
app.register_blueprint(salidas_.salidas_productos_suc)
app.register_blueprint(salidas_.salidas_gestion_ventas_post)
app.register_blueprint(salidas_.salidas_top_ventas)

# detalle de ventas
app.register_blueprint(ventas_.ventas_conteo)
app.register_blueprint(ventas_.ventas_tabla)
app.register_blueprint(ventas_.ventas_comprobante)

# Clientes
app.register_blueprint(clientes_.clientes_db)
app.register_blueprint(clientes_.proveedores_db)
app.register_blueprint(clientes_.clientes_conteo)
app.register_blueprint(clientes_.clientes_tabla)
app.register_blueprint(clientes_.clientes_crud)
app.register_blueprint(clientes_.clientes_remove)
app.register_blueprint(clientes_.clientes_graficos_clientes)

# Transferencias
app.register_blueprint(transferecias_.transferencias_conteo)
app.register_blueprint(transferecias_.transferencias_tabla)
app.register_blueprint(transferecias_.transferencias_conteo_s)
app.register_blueprint(transferecias_.transferencias_tabla_s)
app.register_blueprint(transferecias_.productos_transferencias)

# Despacho
app.register_blueprint(despacho_.perdidas_conteo)
app.register_blueprint(despacho_.perdidas_tabla)

# Sucursales
app.register_blueprint(sucursales_.sucursales_db)

# Categorías
app.register_blueprint(categorias_.categorias_db)
app.register_blueprint(categorias_.categorias_post)
app.register_blueprint(categorias_.categorias_delete)

# Numeracion
app.register_blueprint(numeracion_.negocio_db)

# Usuarios
app.register_blueprint(usuarios_.usuario_db)

# Creditos
app.register_blueprint(creditos_.credito_comprobante)
app.register_blueprint(creditos_.credito_operar_creditos)
app.register_blueprint(creditos_.credito_reporte_dos)
app.register_blueprint(creditos_.creditos_delete)
app.register_blueprint(creditos_.aperturar_creditos_post)



@app.route('/')
def home():
    # Redirigir a Vite en desarrollo
    if app.debug:
        return redirect('http://localhost:5173')
    return render_template('index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # Redirigir a Vite en desarrollo
    if app.debug:
        return redirect(f'http://localhost:5173/{path}')
    return send_from_directory(os.path.join(app.root_path, '../frontend/public'), path)

if __name__ == '__main__':
    app.run(debug=True)