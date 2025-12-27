import axios from "axios";
import { addDays, format } from "date-fns";
import { set } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CouponForm = ({ initialData = null, onSuccess }) => {
  const router = useRouter();
  const isEditMode = !!initialData;

  // Initialize form data
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || "percentage",
    discountValue: initialData?.discountValue || 10,
    minOrderAmount: initialData?.minOrderAmount || 0,
    validFrom: initialData?.validFrom
      ? new Date(initialData.validFrom)
      : new Date(),
    validUntil: initialData?.validUntil
      ? new Date(initialData.validUntil)
      : addDays(new Date(), 30),
    maxUses: initialData?.maxUses || 100,
    isActive: initialData?.isActive ?? true,
    applyTo: initialData?.applyTo || "all",
    uniforms: initialData?.uniforms || [],
    categories: initialData?.categories || [],
    products: initialData?.products || [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [uniformSearch, setUniformSearch] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  // Add/remove categories
  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };
  // Add/remove uniforms
  const handleUniformToggle = (uniformId) => {
      setFormData((prev) => {
        const newUniforms = prev.uniforms.includes(uniformId)
          ? prev.products.filter((id) => id !== uniformId)
          : [...prev.products, uniformId];
        return { ...prev, products: newUniforms };
      });
  };
  // Add/remove products
  const handleProductToggle = (productId) => {
    setFormData((prev) => {
      const newProducts = prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId];
      return { ...prev, products: newProducts };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be positive";
    }

    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (formData.validUntil < formData.validFrom) {
      newErrors.validUntil = "End date must be after start date";
    }

    if (formData.minOrderAmount < 0) {
      newErrors.minOrderAmount = "Minimum order cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token')
      const payload = {
        ...formData,
        token,
        validFrom: formData.validFrom.toISOString(),
        validUntil: formData.validUntil.toISOString(),
      };

      if (isEditMode) {
        await axios.put(`/api/admin/coupons/${initialData._id}`, payload);
      } else {
        await axios.post("/api/admin/coupons", payload);
      }
      toast.success("Coupon created!");
      router.push("/admin/coupons");
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("try later!");
      console.error("Error saving coupon:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to save coupon",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Coupon" : "Create New Coupon"}
      </h1>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.code ? "border-red-500" : "border-gray-300"}`}
                placeholder="e.g. SUMMER20"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                placeholder="Optional description for internal use"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active Coupon
              </label>
            </div>
          </div>

          {/* Discount Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Discount Settings
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
                <option value="freeShipping">Free Shipping</option>
              </select>
            </div>

            {formData.discountType !== "freeShipping" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.discountType === "percentage"
                    ? "Discount Percentage *"
                    : "Discount Amount *"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.discountValue ? "border-red-500" : "border-gray-300"}`}
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    {formData.discountType === "percentage" ? "%" : "Rs"}
                  </span>
                </div>
                {errors.discountValue && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.discountValue}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.minOrderAmount ? "border-red-500" : "border-gray-300"}`}
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-gray-500">PKR</span>
              </div>
              {errors.minOrderAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minOrderAmount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Uses
              </label>
              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                placeholder="0 for unlimited"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Validity Period
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={format(formData.validFrom, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  handleDateChange("validFrom", new Date(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={format(formData.validUntil, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  handleDateChange("validUntil", new Date(e.target.value))
                }
                className={`w-full p-2 border rounded ${errors.validUntil ? "border-red-500" : "border-gray-300"}`}
                min={format(formData.validFrom, "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
              )}
            </div>
          </div>

          {/* Applicability */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Applicability
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply To *
              </label>
              <select
                name="applyTo"
                value={formData.applyTo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="all">All Products</option>
                <option value="categories">Specific Categories</option>
                <option value="products">Specific Products</option>
                <option value="uniforms">Uniforms</option>
              </select>
            </div>
            {formData.applyTo === "uniforms" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Uniforms
                </label>
                <input
                  type="text"
                  value={uniformSearch}
                  onChange={(e) => setUniformSearch(e.target.value)}
                  placeholder="Search uniforms..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {sampleUniforms
                    .filter((uniform) =>
                      uniform.uniformNumberFormate
                        .toLowerCase()
                        .includes(uniformSearch.toLowerCase())
                    )
                    .map((uniform) => (
                      <div key={uniform._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.uniforms.includes(uniform._id)}
                          onChange={() => handleUniformToggle(uniform._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {uniform.uniformNumberFormate}({uniform.size}cm/{uniform.category.toUpperCase()}):  (Rs.{uniform.price}/_)
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {formData.applyTo === "categories" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Categories
                </label>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {/* In a real app, you would fetch and filter categories */}
                  {sampleCategories
                    .filter((cat) =>
                      cat.name
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase())
                    )
                    .map((category) => (
                      <div key={category.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.uniforms.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {formData.applyTo === "products" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Products
                </label>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {/* In a real app, you would fetch and filter products */}
                  {sampleProducts
                    .filter((prod) =>
                      prod.name
                        .toLowerCase()
                        .includes(productSearch.toLowerCase())
                    )
                    .map((product) => (
                      <div key={product.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.products.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {product.name} (${product.price})
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/coupons")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-[#DD8560]/90 disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <span className="flex items-center bg-blue-500 ">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : isEditMode ? (
              "Update Coupon"
            ) : (
              "Create Coupon"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CouponForm;
// Sample data - replace with real API calls in production
const sampleCategories = [
  { id: "cat1", name: "Electronics" },
  { id: "cat2", name: "Clothing" },
  { id: "cat3", name: "Home & Garden" },
  { id: "cat4", name: "Toys" },
  { id: "cat5", name: "Beauty" },
];

const sampleProducts = [
  { id: "prod1", name: "Wireless Earbuds", price: 49.99 },
  { id: "prod2", name: "Smart Watch", price: 99.99 },
  { id: "prod3", name: "Bluetooth Speaker", price: 29.99 },
  { id: "prod4", name: "Phone Case", price: 9.99 },
  { id: "prod5", name: "Desk Lamp", price: 19.99 },
];
const sampleUniforms = [
  { _id: "prod1", uniformNumberFormate: "1", price: 49.99, size:'110', category:"a" },
  { _id: "prod2", uniformNumberFormate: "2", price: 99.99, size:'120', category:"a" },
  { _id: "prod3", uniformNumberFormate: "3", price: 29.99, size:'140', category:"a" },
  { _id: "prod4", uniformNumberFormate: "4", price: 9.99, size:'160', category:"a" },
  { _id: "prod5", uniformNumberFormate: "4", price: 19.99, size:'120', category:"a" },
];