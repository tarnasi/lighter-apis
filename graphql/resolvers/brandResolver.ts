import Brand, { IBrand } from "../../models/Brand";

const brandResolver = {
  Query: {
    brandList: async () => {
      return await Brand.find().populate("category");
    },
    brandSearch: async (_: any, { keyword }: { keyword: string }) => {
      const regex = new RegExp(keyword, "i");
      return await Brand.find({
        $or: [
          { name: { $regex: regex } },
          { slug: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      }).populate("category");
    },
    brand: async (_: any, { id }: { id: string }) => {
      return await Brand.findById(id).populate("category");
    },
  },

  Mutation: {
    createBrand: async (_: any, { input }: { input: any }) => {
      const brand = new Brand({
        ...input,
        category: input.categoryId,
      });
      return await brand.save();
    },
    updateBrand: async (_: any, { input }: { input: any }) => {
      const updated = await Brand.findByIdAndUpdate(
        input.id,
        {
          ...input,
          category: input.categoryId,
        },
        { new: true }
      );
      return updated;
    },
    deleteBrand: async (_: any, { id }: { id: string }) => {
      const result = await Brand.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default brandResolver;
