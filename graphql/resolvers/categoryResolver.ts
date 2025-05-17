import Category, { ICategory } from "../../models/Category";
import Brand from "../../models/Brand"; // 👈 Import Brand model

const categoryResolver = {
  Query: {
    categoryList: async () => {
      return await Category.find();
    },
    categorySearch: async (_: any, { keyword }: { keyword: string }) => {
      const regex = new RegExp(keyword, "i");
      return await Category.find({
        $or: [
          { name: { $regex: regex } },
          { slug: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      });
    },
    category: async (_: any, { id }: { id: string }) => {
      return await Category.findById(id);
    },
  },

  Category: {
    brands: async (parent: ICategory) => {
      return await Brand.find({ category: parent.id });
    },
  },

  Mutation: {
    createCategory: async (_: any, { input }: { input: ICategory }) => {
      const category = new Category(input);
      return await category.save();
    },
    updateCategory: async (
      _: any,
      { input }: { input: ICategory & { id: string } }
    ) => {
      return await Category.findByIdAndUpdate(input.id, input, { new: true });
    },
    deleteCategory: async (_: any, { id }: { id: string }) => {
      const result = await Category.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default categoryResolver;
