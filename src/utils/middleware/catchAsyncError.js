import AppError from "../services/AppError.js"

export  const catchAsyncError=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(error=>{
            next(new AppError(error.message,401))
        })
    }
}
