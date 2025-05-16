export const serializeBrand = (brandDoc: any) => {
  const brand = brandDoc.toObject();

  return {
    ...brand,
    id: brand._id.toString(),
    category: brand.category
      ? {
          ...brand.category,
          id: brand.category._id.toString(),
        }
      : null,
  };
};
