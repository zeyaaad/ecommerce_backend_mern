
import AppError from "../../utils/services/AppError.js";
import { catchAsyncError } from "../../utils/middleware/catchAsyncError.js";
import ApiFeatures from "../../utils/services/apiFeaturs.js";
import { cartModel } from "../../../databases/models/cart.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { productModel } from './../../../databases/models/product.model.js';
import { orderModel } from './../../../databases/models/order.model.js';
import Stripe from "stripe";



export const onlinePayment = catchAsyncError(async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    let cart = await cartModel.findById(req.params.id).populate('cartItems.product');
    if (!cart) return next(new AppError("Not Found Cart", 404));

    let totalPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
    let discount=cart.discount||null;
    const lineItems = cart.cartItems.map(item => ({
        price_data: {
            currency: "egp",
            unit_amount:discount?(item.price*discount/100) * 100:item.price * 100, 
            product_data: {
                name: item.product.title,
                images: [item.product.coverImage], 
            },
        },
        quantity: item.quantity, 
    }));

    let session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `https://ecommercoo.vercel.app/api/v1/ecommerce/order/success/${req.params.id}`,
        cancel_url:`${process.env.FRONT_URL}/cart`, 
        customer_email: req.user.email, 
        client_reference_id: req.user._id, 
        metadata: req.body.shippingAddress, 
    });

    res.json({ message: "success", session: session.url });
});



export const successPayment = catchAsyncError(async (req, res, next) => {
    // Cart by id params 
    let cart = await cartModel.findById(req.params.id);
    if (!cart) return next(new AppError("Not Found Cart", 404));

    // Total price 
    let totalPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;

    // Create order 
    let order = new orderModel({
        user: cart.user,
        cartItems: cart.cartItems,
        totalOrderPrice: cart.totalPrice || totalPrice,
        discount: cart.discount || null,
        totalOrderAfterDiscount: totalPrice,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: "credit",
        isPaid: true,
        paidAt: Date.now()
    });

    // Update quantity and sold
    if (order) {
        let options = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }));

        await productModel.bulkWrite(options);
        await order.save();
    } else {
        return res.status(500).json({ message: "Error creating order. Please check backend." });
    }

    // Remove cart 
    await cartModel.findByIdAndDelete(req.params.id);
    
    res.redirect(`${process.env.FRONT_URL}/success`); 
});





export const cachOrder=catchAsyncError(async(req,res,next)=>{
    // cart by id params 
    let cart =await cartModel.findById(req.params.id);
    if(!cart) return next(new AppError("Not Found Cart",404));

    // total price 
    let totalPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice;

    // create order 
    let order=new orderModel({
        user:req.user._id,
        cartItems:cart.cartItems,
        totalOrderPrice:cart.totalPrice||totalPrice,
        discount:cart.discount||null,
        totalOrderAfterDiscount:totalPrice,
        shippingAddress:req.body.shippingAddress
    }) ;

    // update quantity and sold
    if(order){
        let options=cart.cartItems.map((item)=>({
            updateOne:{
                filter:{_id:item.product},
                update:{$inc:{quantity:-item.quantity,sold:item.quantity}}
            }
        }));
        
        await productModel.bulkWrite(options);
        await order.save()
    }else {
        return res.status(500).json({message:"err to make err check backend"})
    }


    // remove cart 

    await cartModel.findByIdAndDelete(req.params.id);
    res.json({message:"success",order})

})




export const getOwnOrders=catchAsyncError(async(req,res,next)=>{
    
    let data=await orderModel.find({user:req.user._id}).populate("cartItems.product"); 
    res.json({message:"success",data});
})
export const getAllOrders=catchAsyncError(async(req,res,next)=>{
    let apiFeatures=new ApiFeatures(orderModel.find(),req.query).pangination().sort().search().fields().filter()
    let data=await apiFeatures.Query.populate("user","name email");
    res.json({message:"success",data});
})

export const getOrderDetilas=catchAsyncError(async(req,res,next)=>{
    let order=await orderModel.findById(req.params.id).populate("cartItems.product");
    if(!order) return next(new AppError("Not found Order",404));
    res.json({message:"success",data:order});
})
