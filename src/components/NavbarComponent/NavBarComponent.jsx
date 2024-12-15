import React from "react";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import { Checkbox, Col, Rate, Row } from "antd";
import TypeProduct from "../TypeProduct/TypeProduct";

const NavbarComponent = () => {
  const arr = [
    "Laptop",
    "PC",
    "Màn hình",
    "Linh kiện máy tính",
    "Thiết bị mạng",
    "Camera",
    "Máy in và máy scan",
    "Thiết bị lưu trữ",
    "Chuột và Lót chuột",
    "Tai nghe",
    "Bàn phím",
    "Phụ kiện",
  ];
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <WrapperTextValue>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return (
                <Checkbox style={{ marginLeft: 0 }} value={option.value}>
                  {option.lable}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          console.log("check", option);
          return (
            <div style={{ display: "flex" }}>
              <Rate
                style={{ fontSize: "12px" }}
                disabled
                defaultValue={option}
              />
              <span>{`tu ${option} sao`}</span>
            </div>
          );
        });
      case "price":
        return options.map((option) => {
          console.log("check", option);
          return <WrapperTextPrice>{option}</WrapperTextPrice>;
        });

      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLableText>DANH MỤC</WrapperLableText>
      <WrapperContent style={{ cursor: "pointer" }}>
        {arr?.map((item) => {
          return <TypeProduct name={item} key={item} />;
        })}
      </WrapperContent>
    </div>
  );
};

export default NavbarComponent;
