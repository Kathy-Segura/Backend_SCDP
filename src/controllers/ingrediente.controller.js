import {
  listarCategoriasIngrediente,
  listarUnidadesMedida,
  calcularCostoUnitario,
  registrarInsumo,
  historialInsumosRecientes
} from '../models/ingrediente.model.js';

export const getCategorias = async (req, res, next) => {
  try {
    const data = await listarCategoriasIngrediente();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

export const getUnidades = async (req, res, next) => {
  try {
    const data = await listarUnidadesMedida();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};

export const postCalcularCosto = async (req, res, next) => {
  try {
    const { costo_total_compra, cantidad_comprada, unidad_compra_id, cantidad_uso, unidad_uso_id } = req.body;

    if (
      costo_total_compra === undefined || cantidad_comprada === undefined ||
      !unidad_compra_id || cantidad_uso === undefined || !unidad_uso_id
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'costo_total_compra, cantidad_comprada, unidad_compra_id, cantidad_uso y unidad_uso_id son requeridos'
      });
    }

    const resultado = await calcularCostoUnitario({
      costoTotalCompra: costo_total_compra,
      cantidadComprada: cantidad_comprada,
      unidadCompraId: unidad_compra_id,
      cantidadUso: cantidad_uso,
      unidadUsoId: unidad_uso_id
    });

    res.json({ status: 'ok', data: resultado });
  } catch (error) {
    // Errores de negocio que vienen de RAISE EXCEPTION en la función SQL
    if (error.message?.includes('No hay conversión') || error.message?.includes('cantidad comprada')) {
      return res.status(422).json({ status: 'error', message: error.message });
    }
    next(error);
  }
};

export const postRegistrarInsumo = async (req, res, next) => {
  try {
    const { nombre_ingrediente, categoria_id, unidad_id, costo_unitario, stock_inicial, stock_minimo } = req.body;

    if (!nombre_ingrediente || !categoria_id || !unidad_id || costo_unitario === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'nombre_ingrediente, categoria_id, unidad_id y costo_unitario son requeridos'
      });
    }

    await registrarInsumo({
      nombreIngrediente: nombre_ingrediente,
      categoriaId: categoria_id,
      unidadId: unidad_id,
      costoUnitario: costo_unitario,
      stockInicial: stock_inicial,
      stockMinimo: stock_minimo
    });

    res.status(201).json({ status: 'ok', message: 'Ingrediente registrado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const getHistorialInsumos = async (req, res, next) => {
  try {
    const data = await historialInsumosRecientes();
    res.json({ status: 'ok', data });
  } catch (error) {
    next(error);
  }
};