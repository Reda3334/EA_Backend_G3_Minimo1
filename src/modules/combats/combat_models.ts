import mongoose, { Types, model, ObjectId, Schema } from "mongoose";

export interface ICombat{
    
    date : Date;
    gym : Types.ObjectId;
    boxers : Types.ObjectId[];
    isHidden : boolean;
    weightCategory: string; // Nuevo campo

}

const combatSchema = new Schema<ICombat>({
    date :{
        type: Date,
        required : true
    },
    gym: {
        type: Schema.Types.ObjectId,
        ref: "Gym",
        required : true
    },
    boxers: [{
        type : Schema.Types.ObjectId,  
        ref: "User",
        required : true
    }],
    isHidden: {
        type : Boolean,
        default : false
    },
    weightCategory: { // Nuevo campo
        type: String,
        required: false,
        default: "No es competitivo, sin categoría"
    }
});

const Combat = model('Combat', combatSchema);
export default Combat;
