import { globalError } from "../utils/middleware/globalError.js"
import AppError from "../utils/services/AppError.js"
import authRouter from "./auth/auth.routes.js"
import brandRouter from "./brands/brand.routes.js"
import cartRouter from "./cart/cart.routes.js"
import categoryRouter from "./categories/category.routes.js"
import contactRouter from "./contact/contact.routes.js"
import couponRouter from "./coupon/coupon.routes.js"
import filterRouter from "./filter/filter.routes.js"
import orderRouter from "./orders/order.routes.js"
import productRouter from "./products/product.routes.js"
import reviewRouter from "./reviews/review.routes.js"
import subCategoryRouter from "./subcategories/subCategory.routes.js"
import userRouter from "./users/user.routes.js"
import wishListRouter from "./wishList/wishList.routes.js"


export function init(app){

    let Base=`/api/v1/ecommerce` 

app.use(`${Base}/category`,categoryRouter)
app.use(`${Base}/subCategory`,subCategoryRouter)
app.use(`${Base}/brand`,brandRouter)
app.use(`${Base}/product`,productRouter)
app.use(`${Base}/auth`,authRouter)
app.use(`${Base}/user`,userRouter)
app.use(`${Base}/review`,reviewRouter)
app.use(`${Base}/wishList`,wishListRouter)
app.use(`${Base}/coupon`,couponRouter)
app.use(`${Base}/cart`,cartRouter)
app.use(`${Base}/order`,orderRouter)
app.use(`${Base}/filter`,filterRouter)
app.use(`${Base}/contact`,contactRouter)



app.all("*",(req,res,next)=>{
    next(new AppError(`Invaild Url: ${req.originalUrl}`,404))

})


app.use(globalError)
}