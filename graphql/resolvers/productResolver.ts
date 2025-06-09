import Brand, { IBrand } from "../../models/Brand";
import Category, { ICategory } from "../../models/Category";
import Product, { IProduct } from "../../models/Product";

const searchableFields = ["title", "slug", "description"];

const productResolver = {
  Query: {
    productList: async (
      _: any,
      args: {
        categoryId?: string;
        brandId?: string;
        search?: string;
        sort: { field: string; order: "ASC" | "DESC" };
        pagination: { page: number; pageSize: number };
      }
    ) => {
      const { categoryId, brandId, search, sort, pagination } = args;

      // Build MongoDB filter
      const filter: any = {};
      if (categoryId) filter.category = categoryId;
      if (brandId) filter.brand = brandId;

      // Build search filter
      if (search) {
        const regex = new RegExp(search, "i");
        filter["$or"] = searchableFields.map((field) => ({
          [field]: { $regex: regex },
        }));
      }

      // Build sort option
      let sortOption: any = {};
      if (sort?.field) {
        sortOption[sort.field] = sort.order === "ASC" ? 1 : -1;
      }

      // Pagination
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      // Total count (for pagination info)
      const total = await Product.countDocuments(filter);

      // Query with filter, sort, pagination
      const items = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate("category")
        .populate("brand");

      return {
        items,
        total,
        page,
        pageSize,
      };
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
      await product.save();
      return await Product.findById(product._id)
        .populate("category")
        .populate("brand");
    },
    updateProduct: async (_: any, { input }: { input: any }) => {
      await Product.findByIdAndUpdate(input.id, {
        ...input,
        category: input.categoryId,
        brand: input.brandId,
        updated_at: new Date(),
      });

      return await Product.findById(input.id)
        .populate("category")
        .populate("brand");
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default productResolver;
