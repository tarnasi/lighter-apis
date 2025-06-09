import Category, { ICategory } from "../../models/Category";
import Brand, { IBrand } from "../../models/Brand"; // 👈 Import Brand model
import Product from "../../models/Product";

const searchableFields = ["name", "slug", "description"];

const categoryResolver = {
  Query: {
    categoryList: async (
      _: any,
      args: {
        search?: string;
        sort?: { field: string; order: "ASC" | "DESC" };
        pagination?: { page: number; pageSize: number };
      }
    ) => {
      const { search, sort, pagination } = args;

      // Build search filter
      let filter: any = {};
      if (search) {
        const regx = new RegExp(search, "i");
        filter["$or"] = searchableFields.map((field) => ({
          [field]: { $regex: regx },
        }));
      }

      // Sorting
      let sortOption: any = {};
      if (sort) {
        sortOption[sort.field] = sort.order === "ASC" ? 1 : -1;
      }

      // Pagination
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      // Query total count for pagination
      const total = await Category.countDocuments(filter);

      // Query with filters
      const items = await Category.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize);

      return {
        items,
        total,
        page,
        pageSize,
      };
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
      return (await Brand.find({ category: parent.id })) || [];
    },
  },

  Brand: {
    products: async (parent: IBrand) => {
      // Always return array, never null!
      return (await Product.find({ brand: parent.id })) || [];
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
