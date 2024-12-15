import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  filteredProducts: [], // Mảng chứa sản phẩm đã lọc
  products: [], // Đảm bảo rằng products luôn là một mảng trống nếu không có dữ liệu
};

export const productSlide = createSlice({
  name: "product",
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;
      const searchTerm = action.payload.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường

      // Kiểm tra nếu state.products là mảng hợp lệ
      state.filteredProducts = (state.products || []).filter(
        (product) => product.name.toLowerCase().includes(searchTerm) // Kiểm tra tên sản phẩm không phân biệt chữ hoa thường
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions;

export default productSlide.reducer;
