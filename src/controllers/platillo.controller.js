import {
  listarCategoriasPlatillo,
  listarRestaurantes,
  listarIngredientesActivos,
  calcularCostoPlatillo,
  crearPlatillo,
  historialPlatillosRecientes
} from '../models/platillo.model.js';

export const getCategorias = async (req, res, next) => {
  try {
    const data = await listarCategoriasPlatillo();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantes = async (req, res, next) => {
  try {
    const data = await listarRestaurantes();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

export const getIngredientesDisponibles = async (req, res, next) => {
  try {
    const data = await listarIngredientesActivos();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

const validarIngredientes = (ingredientes) => {
  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return 'ingredientes debe ser un arreglo con al menos un ingrediente';
  }
  for (const item of ingredientes) {
    if (!item.ingrediente_id || item.cantidad === undefined) {
      return 'cada ingrediente requiere ingrediente_id y cantidad';
    }
  }
  return null;
};

export const postCalcularCosto = async (req, res, next) => {
  try {
    const { ingredientes } = req.body;

    const errorValidacion = validarIngredientes(ingredientes);
    if (errorValidacion) {
      return res.status(400).json({ status: 'error', message: errorValidacion });
    }

    const resultado = await calcularCostoPlatillo({ ingredientes });
    res.json({ status: 'ok', data: resultado });
  } catch (error) {
    // Errores de negocio que vienen de RAISE EXCEPTION en la función SQL
    if (error.message?.includes('no existe') || error.message?.includes('No hay equivalencia definida')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const postCrearPlatillo = async (req, res, next) => {
  try {
    const { restaurante_id, nombre_platillo, categoria_id, precio_venta, ingredientes } = req.body;

    if (!restaurante_id || !nombre_platillo || !categoria_id || precio_venta === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'restaurante_id, nombre_platillo, categoria_id y precio_venta son requeridos'
      });
    }

    const errorValidacion = validarIngredientes(ingredientes);
    if (errorValidacion) {
      return res.status(400).json({ status: 'error', message: errorValidacion });
    }

    await crearPlatillo({
      restauranteId: restaurante_id,
      nombrePlatillo: nombre_platillo,
      categoriaId: categoria_id,
      precioVenta: precio_venta,
      ingredientes
    });

    res.status(201).json({ status: 'ok', message: 'Platillo registrado correctamente' });
  } catch (error) {
    // Nombre de platillo duplicado en el mismo restaurante
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'error',
        message: 'Ya existe un platillo con ese nombre en este restaurante'
      });
    }
    // Ingrediente inexistente o sin conversión posible (fn_convertir_a_unidad_base)
    if (error.message?.includes('no existe') || error.message?.includes('No hay equivalencia definida')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const getHistorialPlatillos = async (req, res, next) => {
  try {
    const data = await historialPlatillosRecientes();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};
