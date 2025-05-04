import express from "express";

import { sql } from "@/db";
import { errorResponse, successResponse } from "@/lib/utils";
import { insertProductSchema, type Product, type NewProduct } from "@/schemas";
import { validate } from "@/middlewares/validate";

const router = express.Router();

// Fetch products
router.get("/", async (req, res, next) => {
  try {
    const products: Product[] =
      await sql`SELECT * FROM product ORDER BY created_at DESC`;
    successResponse(res, {
      data: products,
      message: "Products fetched",
    });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post("/", validate(insertProductSchema), async (req, res, next) => {
  const data = req.body as NewProduct;
  try {
    const productData = {
      name: data.name,
      price: data.price,
      image: data.image,
    };
    const [newProduct] = await sql`INSERT INTO product ${sql(
      productData
    )} RETURNING *`;
    successResponse(res, {
      data: newProduct,
      status: 201,
      message: "Product created",
    });
  } catch (error) {
    next(error);
  }
});

// Get product by id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [product] = await sql`SELECT * FROM product WHERE id=${id}`;

    if (!product) return errorResponse(res, 404, "Product not found");

    successResponse(res, {
      data: product,
      message: "Product fetched",
    });
  } catch (error) {
    next(error);
  }
});

// Update product
router.patch(
  "/:id",
  validate(insertProductSchema.partial()),
  async (req, res, next) => {
    const data = req.body as Partial<NewProduct>;
    const { id: productId } = req.params;
    try {
      // Only include fields that are not undefined
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      );

      const [updatedProduct] = await sql`UPDATE product SET ${sql(
        updateData
      )} WHERE id=${productId} RETURNING *`;

      if (!updatedProduct) return errorResponse(res, 404, "Product not found");

      successResponse(res, {
        data: updatedProduct,
        message: "Product updated",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete product
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProduct = await sql`
    DELETE FROM product WHERE id=${id} RETURNING *
    `;

    // TODO: return
    if (!deletedProduct) return errorResponse(res, 404, "Product not found");

    successResponse(res, {
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
