import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'too short subCategory name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    image:String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: "category"
    }
}, { timestamps: true })
subCategorySchema.post("init",(doc)=>{
  doc.image=`https://ecommercoo.vercel.app/subCategory/${doc.image}`
})
export const subCategoryModel = mongoose.model('subCategory', subCategorySchema)


