import mongoose,{Schema} from "mongoose";

const productSchema = new Schema({
    title:{type:String,required:true},
    image:{type:String,required:true},
    likes:{type:Number,default:0}
})

export const Product = mongoose.model('Product',productSchema);
