import {
  obtenerResumenCards,
  listarCategorias,
  listarPlatillos,
  obtenerDetallePlatillo,
  listarIngredientesDisponibles,
  listarUnidadesMedida,
  agregarIngredienteAPlatillo,
  quitarIngredienteDePlatillo,
  obtenerResumenEdicion,
  actualizarPlatillo,
  eliminarPlatillo
} from '../models/inventarioPlatillos.model.js';

// Cards del encabezado (total de platillos, total de categorías de platillo)
export const getResumen = async (req, res, next) => {
  try {
    const data = await obtenerResumenCards();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Combo de categorías (filtro de la tabla)
export const getCategorias = async (req, res, next) => {
  try {
    const data = await listarCategorias();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Tabla principal (soporta ?search= y ?categoria_id=)
export const getPlatillos = async (req, res, next) => {
  try {
    const { search, categoria_id } = req.query;
    const data = await listarPlatillos({
      search: search?.trim() || null,
      categoriaId: categoria_id ? Number(categoria_id) : null
    });
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Botón "Ver": encabezado del modal + tabla de ingredientes
export const getDetalle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await obtenerDetallePlatillo(id);

    if (!data.encabezado) {
      return res.status(404).json({ status: 'error', message: 'El platillo no existe' });
    }

    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Combo "agregar ingrediente" del modal Editar (solo ingredientes activos)
export const getIngredientesDisponibles = async (req, res, next) => {
  try {
    const data = await listarIngredientesDisponibles();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Combo "unidad de medida" del modal Editar
export const getUnidadesMedida = async (req, res, next) => {
  try {
    const data = await listarUnidadesMedida();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Botón "Agregar ingrediente": se guarda de inmediato (no espera al botón
// "Guardar cambios") y regresa ya la mini tabla + las 3 cards actualizadas,
// para que el front no tenga que pedirlas aparte.
export const postAgregarIngrediente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ingrediente_id, cantidad, unidad_id } = req.body;

    if (!ingrediente_id || cantidad === undefined || cantidad <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'ingrediente_id y cantidad (mayor a 0) son requeridos'
      });
    }

    await agregarIngredienteAPlatillo({
      platilloId: id,
      ingredienteId: ingrediente_id,
      cantidad,
      unidadId: unidad_id
    });

    const data = await obtenerResumenEdicion(id);
    res.json({ status: 'ok', message: 'Ingrediente agregado a la receta', data });
  } catch (error) {
    // Errores de negocio que vienen de RAISE EXCEPTION en el procedure/función SQL
    if (error.message?.includes('descontinuado') || error.message?.includes('no existe')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Quitar una línea de la receta (complemento, no estaba en la lista original)
export const deleteIngredienteDePlatillo = async (req, res, next) => {
  try {
    const { id, ingredienteId } = req.params;
    await quitarIngredienteDePlatillo({ platilloId: id, ingredienteId });

    const data = await obtenerResumenEdicion(id);
    res.json({ status: 'ok', message: 'Ingrediente quitado de la receta', data });
  } catch (error) {
    if (error.message?.includes('no está en la receta')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Botón "Guardar cambios" (nombre / categoría / precio de venta)
export const putActualizarPlatillo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_platillo, categoria_id, precio_venta } = req.body;

    await actualizarPlatillo({
      id,
      nombre: nombre_platillo,
      categoriaId: categoria_id,
      precioVenta: precio_venta
    });

    res.json({ status: 'ok', message: 'Platillo actualizado' });
  } catch (error) {
    if (error.message?.includes('Ya existe un platillo') || error.message?.includes('no existe')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Botón "Eliminar" (baja lógica, siempre activo=false)
export const deletePlatillo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eliminarPlatillo(id);
    res.json({ status: 'ok', message: 'Platillo desactivado correctamente' });
  } catch (error) {
    next(error);
  }
};
