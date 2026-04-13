function normalizeAndValidateProduct(input) {
  const errors = [];

  const title = String(input?.title ?? "").trim();
  const category = String(input?.category ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const price = Number(input?.price);

  if (!title) errors.push("title is required");
  if (!category) errors.push("category is required");
  if (!description) errors.push("description is required");
  if (!Number.isFinite(price) || price < 0) {
    errors.push("price must be a number >= 0");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      title,
      category,
      description,
      price,
    },
  };
}

module.exports = { normalizeAndValidateProduct };
