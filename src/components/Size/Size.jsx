import React, { useState } from "react";
import { Select, Button } from "antd";

const { Option } = Select;

const Size = () => {
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeChange = (value) => {
    setSelectedSize(value);
  };

  return (
    <div>
      <h3>Chọn kích thước:</h3>
      <Select
        placeholder="Chọn size"
        style={{ width: 200 }}
        onChange={handleSizeChange}
      >
        <Option value="S">S</Option>
        <Option value="M">M</Option>
        <Option value="L">L</Option>
        <Option value="XL">XL</Option>
      </Select>
      {selectedSize && <p>Bạn đã chọn size: {selectedSize}</p>}
    </div>
  );
};

export default Size;
