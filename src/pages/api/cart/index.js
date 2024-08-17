import dbConnect from "../../../backend/config/dbConnect";
import Cart from "../../../backend/models/cart";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.query;

        // Find the cart for the given user ID
        let cart = await Cart.findOne({ userId });

        // If no cart is found, return an empty cart instead of a 404
        if (!cart) {
          cart = { cartItems: [] };
        }

        res.status(200).json({ success: true, cart });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to load cart' });
      }
      break;

    case 'POST':
      try {
        const { userId, cartItems } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
          cart = new Cart({ userId, items: cartItems });
        } else {
          cart.items = cartItems;
        }

        await cart.save();

        res.status(200).json({ success: true, cart });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save cart' });
      }
      break;

      case 'DELETE':
        try {
          const { userId, productId } = req.query;
  
          let cart = await Cart.findOne({ userId });
  
          if (cart) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();
          }
  
          res.status(200).json({ success: true, cart });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Failed to delete item from cart' });
        }
        break;
  
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
