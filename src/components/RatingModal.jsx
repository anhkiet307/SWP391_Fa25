import React, { useState } from "react";
import { Modal, Rate, Button, message } from "antd";
import { StarOutlined } from "@ant-design/icons";

const RatingModal = ({ visible, onCancel, station, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      message.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(rating);
      message.success("Cảm ơn bạn đã đánh giá trạm!");
      setRating(0);
      onCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StarOutlined style={{ color: "#fadb14" }} />
          <span>Đánh giá trạm</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            border: "none",
          }}
        >
          Gửi đánh giá
        </Button>,
      ]}
      width={400}
      centered
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#00083B", fontSize: "18px" }}>
            {station?.name}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
            {station?.address}
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>
            Bạn đánh giá trạm này như thế nào?
          </p>
          <Rate
            value={rating}
            onChange={setRating}
            style={{ fontSize: "32px" }}
            allowClear={false}
          />
        </div>

        {rating > 0 && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
              border: "1px solid rgba(0, 8, 59, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", color: "#00083B" }}>
              {rating === 1 && "😞 Rất không hài lòng"}
              {rating === 2 && "😐 Không hài lòng"}
              {rating === 3 && "😊 Bình thường"}
              {rating === 4 && "😄 Hài lòng"}
              {rating === 5 && "🤩 Rất hài lòng"}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RatingModal;


