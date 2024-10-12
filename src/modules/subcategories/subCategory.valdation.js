import joi from "joi"

export let addsubCategoryShcema=joi.object({
    name:joi.string().min(3).max(20).required(),
    category:joi.string().hex().length(24).required()
})

export let subCategoryIdSchema=joi.object({
    id:joi.string().hex().length(24).required()
})
export let updateSubCategorySchema=joi.object({
    id:joi.string().hex().length(24).required() ,
    name:joi.string().min(3).max(20).required(),
    categoryId:joi.string().hex().length(24).required()

})

