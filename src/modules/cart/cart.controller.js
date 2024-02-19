import { Cart } from "../../../DB/models/cart.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "./../../../DB/models/product.model.js";
import twilio from "twilio";
// add to cart
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found !", { cause: 404 }));
  if (!product.inStock(quantity))
    return next(
      new Error(`sorry only ${product.availableItems} items in stock`, {
        cause: 404,
      })
    );
  const isProductInCart = await Cart.findOne({
    user: req.user.id,
    "products.productId": productId,
  });

  if (isProductInCart) {
    const theProduct = isProductInCart.products.find(
      (prd) => prd.productId.toString() === productId.toString()
    );
    if (product.inStock(theProduct.quantity + quantity)) {
      theProduct.quantity = theProduct.quantity + quantity;
      await isProductInCart.save();
      return res.json({ success: true, cart: isProductInCart });
    } else {
      return next(
        new Error(`sorry only ${product.availableItems} items in stock`, {
          cause: 404,
        })
      );
    }
  }
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $push: { products: { productId, quantity } } },
    { new: true }
  );
  // const accountSid = process.env.TWILIO_SID;
  // const authToken = process.env.TWILIO_AUTH_TOKEN;
  // const client = new twilio(accountSid, authToken);

  // Define the message parameters
  // const messageOptions = {
  //   body: " hi from ecommrece!",
  //   to: "+201066486544", // Replace this with the recipient's phone number
  //   from: "+12622994134", // Replace this with your Twilio phone number
  // };

  // Send the message
  // client.messages
  //   .create(messageOptions)
  //   .then((message) => console.log(`Message sent: ${message.sid}`))
  //   .catch((error) => console.error(`Error sending message: ${error.message}`));

  return res.json({ success: true, cart });
});

//get user cart

export const userCart = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    const cart = await Cart.findOne({ user: req.user._id });
    return res.json({ success: true, cart });
  }
  if (req.user.role == "admin" && !req.body.cart)
    return next(new Error("cart Id is required"));
  const cart = await Cart.findById(req.body.cartId);
  return res.json({ success: true, cart });
});

// update cart
export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found !", { cause: 404 }));
  if (quantity > product.availableItems)
    return next(
      new Error(`sorry only ${product.availableItems} items in stock`, {
        cause: 404,
      })
    );

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    { "products.$.quantity": quantity },
    { new: true }
  );

  return res.json({ success: true, cart });
});

// remove product from cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found !", { cause: 404 }));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );

  return res.json({ success: true, cart });
});

// clear cart

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );

  return res.json({ success: true, cart });
});
