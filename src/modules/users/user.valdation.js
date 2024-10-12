import joi from "joi"

export let UserByIdSchema=joi.object({
    id:joi.string().hex().length(24).required()
})


export let updateUserSchema=joi.object({
    id:joi.string().hex().length(24).required() ,
    name:joi.string().min(3).max(20),
    email:joi.string().email()
})
export let chagePasswordSchema=joi.object({
    id:joi.string().hex().length(24).required() ,
    password:joi.string().min(3).max(25).required(),
})
