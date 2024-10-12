import joi from "joi"

export let addCategoryShcema=joi.object({
    name:joi.string().min(3).max(20).required()
})

export let CategoryIdSchema=joi.object({
    id:joi.string().hex().length(24).required()
})
export let updateCategorySchema=joi.object({
    id:joi.string().hex().length(24).required() ,
    name:joi.string().min(3).max(20).required()
})

