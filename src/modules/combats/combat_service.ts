
import mongoose from 'mongoose';
import Combat, { ICombat } from '../combats/combat_models.js';

export const saveMethod = () => {
    return 'Hola';
};
export const createCombat = async (combatData: ICombat) => {
    try {
        // Validar que los datos requeridos estén presentes
        if (!combatData.gym) {
            throw new Error('El campo "gym" es obligatorio.');
        }
        if (!combatData.boxers || combatData.boxers.length === 0) {
            throw new Error('Debe haber al menos un boxeador en el combate.');
        }

        // Validar y procesar los datos del gimnasio
        if (typeof combatData.gym === 'string') {
            combatData.gym = new mongoose.Types.ObjectId(combatData.gym);
        }

        // Validar y procesar los IDs de los boxeadores
        if (Array.isArray(combatData.boxers)) {
            combatData.boxers = combatData.boxers.map(id =>
                typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
            );
        }

        // Asignar el campo weightCategory si está presente
        const combat = new Combat({
            ...combatData,
            weightCategory: combatData.weightCategory || "No es competitivo, sin categoría"
        });

        return await combat.save();
    } catch (error) {
        console.error('Error en createCombat:', error);
        throw error;
    }
};

export const filterCombatsByWeightCategory = async (category: string) => {
    try {
        return await Combat.find({
            $or: [
                { weightCategory: category },
                { weightCategory: { $exists: false } } // Incluye documentos sin el campo
            ]
        });
    } catch (error) {
        console.error('Error en filterCombatsByWeightCategory:', error);
        throw error;
    }
};

export const getAllCombats = async (page: number, pageSize: number) => {
    try {
        // Contar el número de registros omitidos
        const skip = (page - 1) * pageSize;
        
        // Consulta de registros totales
        const totalCombats = await Combat.countDocuments();
        
        // cCalcular el número total de páginas
        const totalPages = Math.ceil(totalCombats / pageSize);
        
        // cObtener la página actual de registros
        const combats = await Combat.find().skip(skip).limit(pageSize);
        
        // Devolución de información y registros de paginación
        return {
            combats,
            totalCombats,
            totalPages,
            currentPage: page,
            pageSize
        };
    } catch (error) {
        console.error('Error in getAllCombats:', error);
        throw error;
    }
};

export const getCombatById = async (id: string) => {
    return await Combat.findById(id).populate('boxers');
};

export const updateCombat = async (id: string, updateData: Partial<ICombat>) => {
    return await Combat.updateOne({ _id: id }, { $set: updateData });
};

export const deleteCombat = async (id: string) => {
    return await Combat.deleteOne({ _id: id });
};

export const getBoxersByCombatId = async (id: string) => {
    const combat = await Combat.findById(id).populate('boxers');
    return combat ? combat.boxers : [];
};

export const hideCombat = async (id: string, isHidden: boolean) => {
    return await Combat.updateOne({ _id: id }, { $set: { isHidden } });
};  