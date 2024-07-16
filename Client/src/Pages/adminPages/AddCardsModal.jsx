import { Modal, Select } from "antd";
import { useRef, useState } from "react";
import Spinner from "../../Components/Spinner";
import { toast } from "react-hot-toast";
import axios from "axios";
import { regionsArray } from "./ArraysOfSelect";
import API_URL from "../../utils/apiConfig";

// eslint-disable-next-line react/prop-types
const AddCardsModal = ({ showModal, setShowModal, cardTypesArray }) => {
  const [selectedFileCodes, setSelectedFileCodes] = useState(null);
  const fileInputRef = useRef(null);
  const [fileCodes, setFileCodes] = useState({});
  const [loadingCodeParsing, setLoadingCodeParsing] = useState(false);
  const [type, setType] = useState("");
  const [amountt, setAmountt] = useState("");
  const [price, setPrice] = useState({});
  const [quantity, setQuantity] = useState({});
  const [pictureURL, setPictureURL] = useState(null);
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnClose = () => {
    setSelectedFileCodes(null);
    setType("");
    setRegion("");
    setAmountt("");
    setPrice({});
    setFileCodes({});
    setQuantity({});
    setPictureURL(null);
    setShowModal(false);
  };

  const handleFileCodes = (e) => {
    if (e.target.files[0].type !== "text/plain") {
      toast.error("file must be txt file");
      fileInputRef.current.value = null;
      return;
    }

    setLoadingCodeParsing(true);
    const file = e.target.files[0];
    setSelectedFileCodes(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      const codes = lines
        .map((line) => parseInt(line.trim(), 10))
        .filter((code) => !isNaN(code));
      setFileCodes((prevFileCodes) => ({
        ...prevFileCodes,
        [amountt]: { [region]: codes },
      }));
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [amountt]: { [region]: lines.length },
      }));
      setLoadingCodeParsing(false);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i in cardTypesArray) {
      if (
        type.length > 0 &&
        cardTypesArray[i].value.split(" ").join("").toUpperCase() ===
          type.split(" ").join("").toUpperCase()
      ) {
        toast.error("Card Type already exists\nTry To Update it instead!");
        return;
      }
    }

    if (
      type.length === 0 ||
      !region ||
      !quantity ||
      Number(price[amountt]) <= 0 ||
      !pictureURL ||
      !fileCodes
    ) {
      toast.error("Missing Fields!");
      return;
    } else {
      const amountsWithRegions = { [amountt]: [region] };
      try {
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/api/admin/add-cards`,
          {
            type,
            region,
            amountt,
            amountsWithRegions,
            quantity,
            price,
            codes: fileCodes,
            pictureURL,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Saved successfully!");
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoading(false);
          setShowModal(false);
          handleOnClose();
          window.location.reload();
        }
      } catch (error) {
        console.log("erroraa", error);
        setLoading(false);
        setShowModal(false);
      }
    }
  };

  return (
    <Modal
      title="Add New Cards"
      className="font-body"
      open={showModal}
      destroyOnClose
      onCancel={handleOnClose}
      footer={null}
    >
      {/* <Toaster position="top-center" reverseOrder={false} /> */}

      <div className="mt-7 border-t border-t-neutral-400 p-2">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <p className="text-sm font-medium">Type Card Type</p>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
          />

          {type && (
            <>
              <p className="text-sm font-medium">Select Region</p>
              <Select
                defaultValue={region}
                style={{
                  width: 200,
                }}
                onChange={(e) => setRegion(e)}
                options={regionsArray}
              />
            </>
          )}

          {region && (
            <>
              <p className="text-sm font-medium">
                Amount in $:
                <span className="text-xs text-red-700 font-normal">
                  {" "}
                  (One amount can be added at a time)
                </span>
              </p>
              <input
                type="number"
                min={1}
                max={200}
                value={amountt || ""}
                onChange={(e) => setAmountt(e.target.value)}
                className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
              />
            </>
          )}

          {amountt && (
            <>
              <p className="text-sm font-medium">Price in $:</p>
              <input
                type="number"
                min={1}
                value={price[amountt] || ""}
                onChange={(e) =>
                  setPrice({ [amountt]: Number(e.target.value) })
                }
                className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
              />
            </>
          )}

          {loadingCodeParsing ? (
            <Spinner />
          ) : selectedFileCodes ? (
            <p className="text-sm font-medium text-blue-600">
              *File Name:
              <span className="text-xs text-black">
                {" " + selectedFileCodes.name}
              </span>
            </p>
          ) : (
            price[amountt] && (
              <>
                <p className="text-sm font-medium">
                  Upload Text File For Codes:
                  <span className="text-sm text-red-700"> *(.txt)</span>
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileCodes}
                  ref={fileInputRef}
                  className="cursor-pointer mr-56"
                />
              </>
            )
          )}

          {fileCodes[amountt] && (
            <>
              <p className="text-sm font-medium">Quantity:</p>
              <input
                type="number"
                disabled
                id="quantity"
                value={
                  quantity[amountt][region] ? quantity[amountt][region] : 0
                }
                className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2 cursor-not-allowed"
              />
            </>
          )}

          {quantity[amountt] && (
            <>
              <p className="text-sm font-medium">Paste A Picture Link Here:</p>
              <input
                type="text"
                id="pictureURL"
                value={pictureURL || ""}
                onChange={(e) => setPictureURL(e.target.value)}
                className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
              />
            </>
          )}

          <div className="flex justify-end mt-5 gap-3">
            <button
              type="button"
              onClick={handleOnClose}
              disabled={loading}
              className="bg-red-700 px-3 py-2 rounded-md shadow-md text-white text-sm hover:bg-opacity-85 disabled:cursor-not-allowed disabled:bg-opacity-75"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 px-4 py-2 rounded-md shadow-md text-white text-sm hover:bg-opacity-85 disabled:cursor-not-allowed disabled:bg-opacity-75"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCardsModal;
