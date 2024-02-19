import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const updateStock = async (products) => {
  for (const product of products) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        soldItems: product.quantity,
        availableItems: -product.quantity,
      },
    });
  }
};
export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId },{products:[]});
};
