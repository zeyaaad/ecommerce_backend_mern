
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { cartModel } from "../../../databases/models/cart.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { productModel } from './../../../databases/models/product.model.js';
import { couponModel } from "../../../databases/models/coupon.model.js";


function calcPrice(cart){
    let totalPrice=0;
    cart.cartItems.forEach((ele)=>{
        totalPrice+=ele.quantity*ele.price
    })
    cart.totalPrice=totalPrice;
    if(cart.discount) cart.totalPriceAfterDiscount=cart.totalPrice -(cart.totalPrice*cart.discount)/100;

}

export const addCart=catchAsyncError(async(req,res,next)=>{

    let product=await productModel.findById(req.body.product);

    !product&&  next(new AppError("Product Not found",404))

    req.body.price=product.price;

    let isCartExist=await cartModel.findOne({user:req.user._id});
    if(!isCartExist){
        let cart=new cartModel({   
            user:req.user._id,
            cartItems:[req.body]
         });
        cart.totalPrice=req.body.price;
        await cart.save()
        return res.status(201).json({message:"success",cart})
    }

    let item=isCartExist.cartItems.find(ele=>ele.product==req.body.product);
    if(item){
        let newQuantity=item.quantity+1;
        let product=await productModel.findById(item.product)
        if(newQuantity>product.quantity){
            return next(new AppError("No Available Quantity In Stock",400));
        }
        item.quantity+=1
        
    } else {
        if(product.quantity<1) return next(new AppError("No Available Quantity In Stock",400));
        isCartExist.cartItems.push(req.body);
   }   

    calcPrice(isCartExist)
    await isCartExist.save()
    res.json({message:"success",cart:isCartExist})

})




export const getCart=catchAsyncError(async(req,res,next)=>{

    let data =await cartModel.findOne({user:req.user._id}).populate("cartItems.product")
    
    res.json({message:"success",data})


})
export const deleteFromCart=catchAsyncError(async(req,res,next)=>{
    let data =await cartModel.findOneAndUpdate({user:req.user._id},{$pull:{cartItems:{_id:req.params.id}}},{new:true})
    calcPrice(data)
    if(data.discount){
        await cartModel.findOneAndUpdate({user:req.user._id},{totalPrice:data.totalPrice,totalPriceAfterDiscount:data.totalPriceAfterDiscount})
    } else {
        await cartModel.findOneAndUpdate({user:req.user._id},{totalPrice:data.totalPrice})
    }
    res.json({message:"success",data})


})


export const updateCart=catchAsyncError(async(req,res,next)=>{

    if(req.body.quantity<1){
        next(deleteFromCart);
        return;
    }


    let isCartExist=await cartModel.findOne({user:req.user._id});

    !isCartExist&& next(new AppError("Not found cart",404))

    let item=isCartExist.cartItems.find(ele=>ele._id==req.params.id);
    !item&& next(new AppError("not found item",404))


    let product=await productModel.findById(item.product);
    
    if(req.body.quantity>product.quantity){
        return next(new AppError("max Qauntity",400));
    }

    item.quantity=req.body.quantity;
    
   calcPrice(isCartExist)
    await isCartExist.save()

    res.json({message:"success",cart:isCartExist})

})







export const clearCart=catchAsyncError(async(req,res,next)=>{


    let isCartExist=await cartModel.findOne({user:req.user._id});

    !isCartExist&& next(new AppError("Not found cart",404))

    isCartExist.cartItems=[];
    isCartExist.count=0;
    isCartExist.discount=null;
    isCartExist.totalPriceAfterDiscount=null;
    isCartExist.totalPrice=0
    await isCartExist.save()

    res.json({message:"success"})

})


export const applyCoupon = catchAsyncError(async (req, res, next) => {
    let coupon = await couponModel.findOne({ code: req.params.code });

    if (!coupon) {
        return next(new AppError("Invalid code", 400));
    }

    const now = new Date();

    if (now > new Date(coupon.expires)) {
        return res.status(400).json({
            message: "Coupon expired",
            expires: coupon.expires 
        });
    }

    let cart = await cartModel.findOne({ user: req.user._id });

    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100 ;
    cart.discount = coupon.discount;

    await cart.save();

    res.json({ message: "Success", cart });
});

