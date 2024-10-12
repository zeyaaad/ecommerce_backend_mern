import joi from "joi"

export let addBrandShcema=joi.object({
    name:joi.string().min(3).max(20).required()
})

export let BrandIdSchema=joi.object({
    id:joi.string().hex().length(24).required()
})
export let updateBrandSchema=joi.object({
    id:joi.string().hex().length(24).required() ,
    name:joi.string().min(3).max(20).required()
})

