export class ObjGeneral {
    constructor(idProd, categoria, codigo, descripcion, talla, existencias_ac, existencias_su, 
                existencias_sd, existencias_st, existencias_sc, costo, precio, lote, 
                proveedor, q_ac, q_su, q_sd, q_st, q_sc, motivo) {
        this.idProd = idProd;
        this.categoria = categoria;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.talla = talla;
        this.existencias_ac = existencias_ac;
        this.existencias_su = existencias_su;
        this.existencias_sd = existencias_sd;
        this.existencias_st = existencias_st;
        this.existencias_sc = existencias_sc;
        this.costo = costo;
        this.precio = precio;
        this.lote = lote;
        this.proveedor = proveedor;
        this.q_ac = q_ac;
        this.q_su = q_su;
        this.q_sd = q_sd;
        this.q_st = q_st;
        this.q_sc = q_sc;
        this.motivo = motivo;
    };

    total_costo(indice) {
        if (indice >= 0 && indice < sucursales_activas.length) {
            return this[sucursales_activas[indice]] * this.costo;
        } else {
            throw new Error('Índice fuera de rango');
        };
    };
    in_q_q(input_value, indice_sucursal){//ventas
        if(Number(input_value) > 0 || !isNaN(Number(input_value))){
            this[sucursales_activas[indice_sucursal]] = this[sucursales_activas[indice_sucursal]] + Number(input_value);
        };
        return this[sucursales_activas[indice_sucursal]];
    };
    in_q(input, indice_sucursal){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this[sucursales_activas[indice_sucursal]] = Number(input.value);
            input.style.background = "";
        };
    };
    in_c(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.costo = Number(input.value);
            blurInputMoneda(input);
            input.style.background = "";
        };
    };
    in_p(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.precio = Number(input.value);
            blurInputMoneda(input);
            console.log(input)
            input.style.background = "";
        };
    };
    in_p_v(input_value){
        if(Number(input_value) > 0 || !isNaN(Number(input_value))){
            this.precio = Number(input_value);
        };
        return this.precio
    };
    in_l(input){
        if(Number(input.value) < 0 || isNaN(Number(input.value))){
            input.style.background = "var(--fondo-marca-uno)";
        }else{
            this.lote = Number(input.value);
            input.style.background = "";
        };
    };
    in_d(input){
        if(expregul.descripcion.test(input.value) || input.value !== ""){
            this.descripcion = input.value;
            input.style.background = "";
        } else {
            input.style.background = "var(--fondo-marca-uno)";
        };
    };
    in_cod(input){
        if(expregul.codigo.test(input.value) || input.value !== ""){
            this.codigo = input.value;
            input.style.background = "";
        } else {
            input.style.background = "var(--fondo-marca-uno)";
        };
    };
    in_t(indice_origen){
        let suma = 0;
        sucursales_activas.forEach((e)=>{
            if(e !== sucursales_activas[indice_origen]){
                suma+=this[e]
            }
        })
        this[sucursales_activas[indice_origen]] = -suma
        return suma;
    };
    in_r(){//reset
        this.existencias_ac = 0; 
        this.existencias_su = 0; 
        this.existencias_sd = 0; 
        this.existencias_st = 0; 
        this.existencias_sc = 0;
    };
    condicion(){//verifica si algun saldo de existencias en la sucursal de origen es negativo
        let resultado = true
        sucursales_activas.forEach((e, i)=>{
            if(this[in_existencias[i]] + this[e] < 0){
                resultado = false
            }
        })
        return resultado
    }
    val_exs(){ 
        return [   
                    this.existencias_ac,
                    this.existencias_su,
                    this.existencias_sd,
                    this.existencias_st,
                    this.existencias_sc
                ]
    }
    suma_val_exs(){
        return this.val_exs().reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    }
    val_sal(){
        return [   
                    this.q_ac - this.existencias_ac,
                    this.q_su - this.existencias_su,
                    this.q_sd - this.existencias_sd,
                    this.q_st - this.existencias_st,
                    this.q_sc - this.existencias_sc
                ]
    }
};