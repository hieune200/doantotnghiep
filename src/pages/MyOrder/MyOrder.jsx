import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receivedOrderId, setReceivedOrderId] = useState(null); // Lưu ID đơn hàng đã nhận

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const user = useSelector((state) => state.user);

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state?.id && state?.token,
    }
  );

  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleConfirmReceiveOrder = async (order) => {
    try {
      const response = await OrderService.successOrder(order._id, state?.token);
      if (response.status === "OK") {
        setReceivedOrderId(order._id);
        message.success("Bạn đã nhận đơn hàng thành công!");
        queryOrder.refetch();
      } else {
        message.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error("Error confirming order:", error);
    }
  };

  const showCancelModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleConfirmCancel = () => {
    if (selectedOrder) {
      mutation.mutate(
        {
          id: selectedOrder._id,
          token: state?.token,
          orderItems: selectedOrder?.orderItems,
          userId: user.id,
        },
        {
          onSuccess: () => {
            queryOrder.refetch();
          },
        }
      );
    }
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      const isReceived = receivedOrderId === order._id || order.isDelivered; // Kiểm tra trạng thái đã nhận
      return (
        <WrapperItemOrder key={order?._id}>
          <WrapperStatus>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              Trạng thái
            </span>
            <div>
              <span style={{ color: "rgb(255, 66, 78)" }}>Giao hàng: </span>
              <span
                style={{
                  color: "rgb(90, 32, 193)",
                  fontWeight: "bold",
                }}
              >
                {`${order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}`}
              </span>
            </div>
            <div>
              <span style={{ color: "rgb(255, 66, 78)" }}>Thanh toán: </span>
              <span
                style={{
                  color: "rgb(90, 32, 193)",
                  fontWeight: "bold",
                }}
              >
                {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
              </span>
            </div>
          </WrapperStatus>
          {order?.orderItems.map((item, index) => (
            <WrapperHeaderItem key={index}>
              <img
                src={item?.image}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  border: "1px solid rgb(238, 238, 238)",
                  padding: "2px",
                }}
              />
              <div
                style={{
                  width: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginLeft: "10px",
                }}
              >
                {item?.name}(size:{item?.size})
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "#242424",
                  marginLeft: "auto",
                }}
              >
                {convertPrice(item?.price)}
              </span>
            </WrapperHeaderItem>
          ))}
          <WrapperFooterItem>
            <div>
              <span style={{ color: "rgb(255, 66, 78)" }}>Tổng tiền: </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgb(56, 56, 61)",
                  fontWeight: 700,
                }}
              >
                {convertPrice(order?.totalPrice)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <ButtonComponent
                onClick={() => handleConfirmReceiveOrder(order)}
                size={40}
                styleButton={{
                  height: "36px",
                  border: "1px solid #9255FD",
                  borderRadius: "4px",
                }}
                textbutton={"Đã nhận đơn hàng"}
                styleTextButton={{
                  color: "#9255FD",
                  fontSize: "14px",
                }}
                disabled={order.isDelivered || receivedOrderId === order._id} // Đã nhận đơn hàng sẽ vô hiệu hóa
              ></ButtonComponent>
              <ButtonComponent
                onClick={() => showCancelModal(order)}
                size={40}
                styleButton={{
                  height: "36px",
                  border: "1px solid #9255FD",
                  borderRadius: "4px",
                }}
                textbutton={"Hủy đơn hàng"}
                styleTextButton={{
                  color: "#9255FD",
                  fontSize: "14px",
                }}
                disabled={order.isDelivered || receivedOrderId === order._id} // Đã nhận đơn hàng sẽ vô hiệu hóa
              ></ButtonComponent>
              <ButtonComponent
                onClick={() => handleDetailsOrder(order?._id)}
                size={40}
                styleButton={{
                  height: "36px",
                  border: "1px solid #9255FD",
                  borderRadius: "4px",
                }}
                textbutton={"Xem chi tiết"}
                styleTextButton={{
                  color: "#9255FD",
                  fontSize: "14px",
                }}
              ></ButtonComponent>
            </div>
          </WrapperFooterItem>
        </WrapperItemOrder>
      );
    });
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {Array.isArray(data) && renderProduct(data)}
          </WrapperListOrder>
        </div>
      </WrapperContainer>

      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isModalVisible}
        onOk={handleConfirmCancel}
        onCancel={handleCancelModal}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
      </Modal>
    </Loading>
  );
};

export default MyOrderPage;
