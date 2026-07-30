import {
  obtenerResumenCards,
  listarCategorias,
  listarUnidadesMedida,
  listarInventario,
  actualizarIngrediente,
  eliminarIngrediente,
  reactivarIngrediente
} from '../models/inventarioIngredientes.model.js';

// Cards del dashboard (total ingredientes activos, valor de inventario, stock bajo)
export const getResumen = async (req, res, next) => {
  try {
    const data = await obtenerResumenCards();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Combo de categorías (filtro de la tabla y form de edición)
export const getCategorias = async (req, res, next) => {
  try {
    const data = await listarCategorias();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Combo de unidades de medida (form de edición, cambio de unidad base)
export const getUnidadesMedida = async (req, res, next) => {
  try {
    const data = await listarUnidadesMedida();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

// Tabla principal (soporta ?search= y ?categoria_id=)
export const getInventario = async (req, res, next) => {
  try {
    const { search, categoria_id } = req.query;
    const data = await listarInventario({
      search: search?.trim() || null,
      categoriaId: categoria_id ? Number(categoria_id) : null
    });

    // Se agrega "estado" legible para el front (columna "estado" de la tabla),
    // sin perder el booleano "activo" por si el front prefiere manejarlo aparte.
    const dataConEstado = data.map((row) => ({
      ...row,
      estado: row.activo ? 'Activo' : 'Descontinuado'
    }));

    res.json({ status: 'ok', data: dataConEstado });
  } catch (error) {
    next(error);
  }
};

// Botón "Editar": único endpoint que actualiza nombre, categoría, unidad,
// costo y/o stock (todo opcional salvo el id -> lo que no se manda no se
// toca). El valor_total NUNCA se edita acá porque es una columna calculada
// (costo_unitario * stock_actual), no un dato propio del ingrediente.
export const putActualizarIngrediente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      categoria_id,
      unidad_id,
      costo_unitario,
      stock,
      motivo_ajuste_stock
    } = req.body;

    await actualizarIngrediente({
      id,
      nombre,
      categoriaId: categoria_id,
      unidadId: unidad_id,
      costoUnitario: costo_unitario,
      nuevoStock: stock,
      motivoAjusteStock: motivo_ajuste_stock
    });

    res.json({ status: 'ok', message: 'Ingrediente actualizado' });
  } catch (error) {
    // Errores de negocio que vienen de RAISE EXCEPTION en sp_actualizar_ingrediente
    // (ingrediente inexistente, o cambio de unidad no permitido entre grupos
    // físicos distintos / unidades de tipo "conteo").
    if (
      error.message?.includes('no existe') ||
      error.message?.includes('No se puede cambiar la unidad base')
    ) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Botón "Desactivar": baja lógica automática si el ingrediente está en uso
// en algún platillo, baja física si nunca se usó en ninguna receta.
export const deleteIngrediente = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eliminarIngrediente(id);
    res.json({ status: 'ok', message: 'Ingrediente eliminado o desactivado correctamente' });
  } catch (error) {
    if (error.message?.includes('no existe')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

// Botón "Reactivar": solo válido para ingredientes con activo = false.
export const putReactivarIngrediente = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reactivarIngrediente(id);
    res.json({ status: 'ok', message: 'Ingrediente reactivado correctamente' });
  } catch (error) {
    // sp_reactivar_ingrediente lanza 'no existe' y 'ya está activo' como
    // errores de negocio, no como fallas de servidor.
    if (error.message?.includes('no existe') || error.message?.includes('ya está activo')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};