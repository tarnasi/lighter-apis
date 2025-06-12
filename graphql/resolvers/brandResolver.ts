import Brand, { IBrand } from "../../models/Brand";
import Category from "../../models/Category";
import Product from "../../models/Product";

const searchableFields = ["name", "slug", "description"];

const brandResolver = {
  Query: {
    brandList: async (
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
      const total = await Brand.countDocuments(filter);

      // Query with filters
      const items = await Brand.find(filter)
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

    brand: async (_: any, { id }: { id: string }) => {
      return await Brand.findById(id).populate("category");
    },

    brandByCategorySlug: async (
      _: any,
      args: {
        catSlug: string;
        pagination: { page: number; pageSize: number };
      }
    ) => {
      const {
        catSlug,
        pagination: { pageSize = 100, page = 1 }
      } = args;
      const skip = (page - 1) * pageSize;

      if (catSlug === 'all') {
        const total = await Brand.countDocuments();
        const items = await Brand.find()
          .skip(skip)
          .limit(pageSize)
          .populate("category");

        return {
          items,
          total,
          pageSize,
          page,
        };
      }

      const category = await Category.findOne({ slug: catSlug });
      if (!category) {
        console.error(`No category found for slug: ${catSlug}`);
        return [];
      }

      const total = await Product.countDocuments({ category: category._id });
      const items = await Brand.find({ category: category._id })
        .skip(skip)
        .limit(pageSize)
        .populate("category");

      return {
        items,
        total,
        pageSize,
        page,
      };
    },
  },

  Brand: {
    products: async (parent: IBrand) => {
      return (await Product.find({ brand: parent.id })) || [];
    },
  },

  Mutation: {
    createBrand: async (_: any, { input }: { input: any }) => {
      const brand = new Brand({
        ...input,
        category: input.categoryId,
      });
      await brand.save();
      return brand.populate("category");
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
      return updated.populate("category");
    },

    deleteBrand: async (_: any, { id }: { id: string }) => {
      const result = await Brand.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default brandResolver;
