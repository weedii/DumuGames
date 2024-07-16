import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 60,
              marginBottom: 300,
            }}
            spin
          />
        }
      />
    </div>
  );
};

export default Spinner;
