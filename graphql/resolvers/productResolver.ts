import Category from "../../models/Category";
import Product from "../../models/Product";

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

    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id).populate("category").populate("brand");
    },

    productByCategorySlug: async (
      _: any,
      args: {
        catSlug: string;
        pagination: { page: number; pageSize: number };
        sort: { field: string; order: "ASC" | "DESC" };
      }
    ) => {
      const { catSlug, pagination: {pageSize = 10, page = 1}, sort } = args;

      // Find category
      const category = await Category.findOne({ slug: catSlug });
      if (!category) {
        console.error(`No category found for slug: ${catSlug}`);
        return [];
      }

      // Build sort option
      let sortOption: any = {};
      if (sort?.field) {
        sortOption[sort.field] = sort.order === "ASC" ? 1 : -1;
      }

      const total = await Product.countDocuments({ category: category._id });

      // Calculate skip value
      const skip = (page - 1) * pageSize;
      // Find products
      const items = await Product.find({ category: category._id })
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate("brand")
        .populate("category");

      return {
        items,
        total,
        pageSize,
        page
      };
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
