import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel, Image } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../redux/slices/foodSlice";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import AdminFoodList from "../../components/admin/AdminFoodList";

const foods = ({ result }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    user: { user },
    food: { data },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFoods());
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = JSON.parse(window.localStorage.getItem('token'));

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('cost', cost);
      formData.append('description', description);
      formData.append('image', selectedImage);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/food/new`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      setName('');
      setCategory('');
      setCost('');
      setDescription('');
      setSelectedImage(null);
      setOpenModal(false);

      enqueueSnackbar(response.data.message, {
        variant: 'success',
        autoHideDuration: 3000,
      });

      // Fetch updated food data
      dispatch(fetchFoods());
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  

  useEffect(() => {
    if (user === null) {
      Router.push("/");
    }
  }, [user]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3 ">
            <AdminSidebar />
            <div className="flex-grow ml-5 min-w-fit">
              <div className="flex flex-col items-center">
                <h1 className="mb-5 text-lg font-semibold text-green-400">
                  FOOD ITEMS
                </h1>
                {data.map((item) => {
                  return <AdminFoodList key={item._id} item={item} />;
                })}
              </div>
            </div>
          </div>
          <div className="min-h-[83vh] p-3 lg:hidden">
            {/* Mobile virsion */}
            <div className="flex flex-col">
              <AdminDrawer />
              <div className="flex flex-col items-center justify-center mt-3">
                <h1 className="text-lg font-semibold text-green-400">
                  FOOD ITEMS
                </h1>
                {data.map((item) => {
                  return <AdminFoodList key={item._id} item={item} />;
                })}
              </div>
            </div>
          </div>
          <Tooltip title="Add new food">
            <div
              className="fixed flex items-center justify-center transition duration-300 ease-in bg-green-600 rounded-full cursor-pointer h-14 w-14 hover:scale-110 bottom-32 right-4 md:right-28"
              onClick={() => setOpenModal(true)}
            >
              <Add className="text-3xl font-bold text-white" />
            </div>
          </Tooltip>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="h-full w-full md:h-[600px] md:w-[450px] border-none rounded-lg outline-none bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="relative flex flex-col items-center justify-center h-full">
                <form
                encType="multipart/form-data"
                  className="flex flex-col items-center justify-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 mt-3 font-semibold bg-transparent border-2 border-green-400 rounded-lg outline-none placeholder:text-sm"
                    type="text"
                    placeholder="Food name"
                  />
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 mt-3 font-semibold bg-transparent border-2 border-green-400 rounded-lg outline-none placeholder:text-sm"
                    type="text"
                    placeholder="Category"
                  />
                  <input
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="p-3 mt-3 font-semibold bg-transparent border-2 border-green-400 rounded-lg outline-none placeholder:text-sm"
                    type="text"
                    placeholder="Price"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 mt-3 font-semibold bg-transparent border-2 border-green-400 rounded-lg outline-none placeholder:text-sm"
                    type="text"
                    placeholder="Description"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <label htmlFor="image">
                      <Image className="text-3xl text-green-500 cursor-pointer" />{" "}
                      <h1 className="mt-2 mb-3 text-sm font-semibold text-white">
                      {selectedImage ? selectedImage.name : 'No file selected'}
                      </h1>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        setSelectedImage(e.target.files[0])
                      }}
                      className="w-48 opacity-0"
                      id="image"
                    />
                  </div>
                  <input
                    type="submit"
                    value={"Add New Food"}
                    className="w-full p-3 mt-3 font-bold text-green-500 transition duration-300 ease-in bg-white rounded-lg outline-none cursor-pointer hover:bg-green-400 hover:text-white"
                  />
                </form>
                <div className="absolute flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full cursor-pointer top-2 left-2">
                  <Cancel
                    className="text-3xl"
                    onClick={() => setOpenModal(false)}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default foods;
