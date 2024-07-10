import { useState, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { message } from "antd";

// eslint-disable-next-line react/prop-types
const UploadIdentity = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const input = e.target.files[0];
    if (input) {
      const isImage = input.type.split("/")[0] === "image";
      if (!isImage) {
        message.error("You can only upload image files!");
        return;
      }
      if (input.size / 1024 / 1024 > 2) {
        message.error("Image must be smaller than 2MB!");
        return;
      }

      setFile(input);
      onFileChange(input);
    }
  };

  const handleRemove = () => {
    fileInputRef.current.value = null;
    setFile(null);
    onFileChange(null);
  };

  return (
    <div className="w-1/2">
      <input
        type="file"
        onChange={handleChange}
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
      />

      {!file ? (
        <div
          className="bg-slate-100 flex flex-col justify-center items-center px-4 py-6 outline-dashed outline-1 outline-offset-1 outline-slate-400 rounded-md cursor-pointer hover:outline-blue-500 duration-200"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="font-semibold">+</p>
          <p className="font-semibold">Upload</p>
        </div>
      ) : (
        <div className="bg-slate-100 flex flex-col justify-center items-center px-2 py-4 outline-dashed outline-1 outline-offset-1 outline-slate-400 rounded-md">
          <img src={URL.createObjectURL(file)} className="w-20" />
          <IoMdTrash
            size={20}
            className="mt-3 text-red-700 hover:text-red-800 cursor-pointer"
            onClick={handleRemove}
          />
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const UploadSelfieIdentity = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const input = e.target.files[0];
    if (input) {
      const isImage = input.type.split("/")[0] === "image";
      if (!isImage) {
        message.error("You can only upload image files!");
        return;
      }
      if (input.size / 1024 / 1024 > 2) {
        message.error("Image must be smaller than 2MB!");
        return;
      }

      setFile(input);
      onFileChange(input);
    }
  };

  const handleRemove = () => {
    fileInputRef.current.value = null;
    setFile(null);
    onFileChange(null);
  };

  return (
    <div className="w-1/2">
      <input
        type="file"
        onChange={handleChange}
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
      />

      {!file ? (
        <div
          className="bg-slate-100 flex flex-col justify-center items-center px-4 py-6 outline-dashed outline-1 outline-offset-1 outline-slate-400 rounded-md cursor-pointer hover:outline-blue-500 duration-200"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="font-semibold">+</p>
          <p className="font-semibold">Upload</p>
        </div>
      ) : (
        <div className="bg-slate-100 flex flex-col justify-center items-center px-2 py-4 outline-dashed outline-1 outline-offset-1 outline-slate-400 rounded-md">
          <img src={URL.createObjectURL(file)} className="w-20" />
          <IoMdTrash
            size={20}
            className="mt-3 text-red-700 hover:text-red-800 cursor-pointer"
            onClick={handleRemove}
          />
        </div>
      )}
    </div>
  );
};

export { UploadIdentity, UploadSelfieIdentity };
