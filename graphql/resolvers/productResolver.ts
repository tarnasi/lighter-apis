import Product from "../../models/Product";

const productResolver = {
  Query: {
    productList: async () => {
      return await Product.find().populate("category").populate("brand");
    },
    productSearch: async (_: any, { keyword }: { keyword: string }) => {
      const regex = new RegExp(keyword, "i");
      return await Product.find({
        $or: [
          { title: { $regex: regex } },
          { slug: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      })
        .populate("category")
        .populate("brand");
    },
    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id).populate("category").populate("brand");
    },
  },

  Mutation: {
    createProduct: async (_: any, { input }: { input: any }) => {
      const product = new Product({
        ...input,
        category: input.categoryId,
        brand: input.brandId,
      });
      await product.save()
      return product.populate("category").populate("brand");
    },
    updateProduct: async (_: any, { input }: { input: any }) => {
      const updated = await Product.findByIdAndUpdate(
        input.id,
        {
          ...input,
          category: input.categoryId,
          brand: input.brandId,
          updated_at: new Date(),
        },
        { new: true }
      );
      return updated.populate("category").populate("brand");
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default productResolver;
