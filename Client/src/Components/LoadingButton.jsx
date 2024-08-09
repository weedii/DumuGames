import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
const LoadingButton = ({ color }) => {
  return (
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 20,
            color: color ? `${color}` : "white",
          }}
          spin
        />
      }
    />
  );
};

export default LoadingButton;
