import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [inputQuantity, setInputQuantity] = useState("");
  const [error, setError] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockPrice, setNewStockPrice] = useState("");
  const [newStockQuantity, setNewStockQuantity] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/stocks");
        if (Array.isArray(data)) {
          setStocks(data.map(stock => ({
            ...stock,
            initialQuantity: stock.quantity, // Store initial quantity
            initialPrice: stock.price, 
          })));
        } else {
          console.error("Data is not an array:", data);
          setStocks([]);
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setStocks([]);
      }
    };
    fetchStocks();
  }, []);

  const openModal = (id, action) => {
    setModalData({ id, action });
    setInputQuantity("");
    setError("");
  };

  const closeModal = () => {
    setModalData(null);
    setInputQuantity("");
    setError("");
  };

  const handleUpdate = async () => {
    const { id, action } = modalData;
    const item = stocks.find((stock) => stock._id === id);
    const quantityToUpdate = Number(inputQuantity);

    if (quantityToUpdate <= 0) {
      toast("Invalid Request! Quantity must be greater than zero.", { autoClose: 5000 });
      return;
    }

    const newQuantity = action === "buy" ? item.quantity + quantityToUpdate : item.quantity - quantityToUpdate;

    if (action === "sell" && (newQuantity < 0 || item.quantity < quantityToUpdate)) {
      toast("Invalid Request! Cannot sell more than total available quantity.", { autoClose: 5000 });
      return;
    }

    try {
      let updatedStock;
      if (newQuantity === 0) {
        updatedStock = await axios.delete(`http://localhost:8000/api/stocks/${id}`);
      } else {
        updatedStock = await axios.put(`http://localhost:8000/api/stocks/${id}`, {
          quantity: newQuantity,
          price: item.price, // Ensure to send the latest price
        });
      }

      if (updatedStock?.data) {
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock._id === id
              ? {
                  ...stock,
                  quantity: newQuantity,
                  price: updatedStock.data.price,
                }
              : stock
          )
        );
        closeModal();
      } else {
        toast("Error: Invalid response data");
      }
    } catch (error) {
      toast("Error updating stock, please try again", { autoClose: 5000 });
    }
  };

  const addNewItem = async () => {
    if (!newStockName || !newStockPrice || isNaN(newStockPrice) || newStockPrice <= 0 || isNaN(newStockQuantity) || newStockQuantity <= 0) {
      toast("Please enter valid stock name, price, and quantity!");
      return;
    }

    const newStock = {
      name: newStockName,
      quantity: Number(newStockQuantity),
      price: Number(newStockPrice),
    };

    try {
      const { data } = await axios.post("http://localhost:8000/api/stocks", newStock);
      setStocks([...stocks, data]);
      setNewStockName("");
      setNewStockPrice("");
      setNewStockQuantity("");
      closeModal();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-4">
      {/* Navbar with 3D Trading Style Logo */}
      <div className="flex justify-between items-center mb-6">
    <div className="flex items-center">
      <h1 className="text-3xl font-extrabold tracking-widest text-gradient">Stock Management System</h1>
      <div className="ml-1">
        <span className="text-3xl font-bold text-gray-300 drop-shadow-2xl">📊</span>
      </div>
    </div>
        <button
          onClick={() => openModal(null, "add")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-all"
        >
          ADD ITEMS
        </button>
      </div>

      {/* Stock Table */}
      <table className="w-full text-left border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-4 w-1/6 text-center">SerialNo.</th>
            <th className="p-4 text-center">Stock Name</th>
            <th className="p-4 text-center">Quantity</th>
            <th className="p-4 text-center">Price ($)</th>
            <th className="p-4 text-center">Total Amount (₹)</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item, index) => (
            <tr key={item._id} className="bg-gray-700 hover:bg-gray-600 transition-all">
              <td className="p-4 w-1/12 text-center">{index + 1}</td>
              <td className="p-4 text-center">{item.name}</td>
              <td className="p-4 text-center">{item.quantity}</td>
              <td className="p-4 text-center">{item.price}</td>
              <td className="p-4 text-center">{item.quantity * item.price}</td>
              <td className="p-4 flex justify-center gap-2">
                <button
                  onClick={() => openModal(item._id, "buy")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transform transition-all"
                >
                  Buy
                </button>
                <button
                  onClick={() => openModal(item._id, "sell")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transform transition-all"
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Modal for Add */}
      {modalData && modalData.action === "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Stock Item</h2>
            <input
              type="text"
              placeholder="Stock Name"
              className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStockPrice}
              onChange={(e) => setNewStockPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStockQuantity}
              onChange={(e) => setNewStockQuantity(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addNewItem}
                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Buy/Sell */}
      {modalData && modalData.action !== "add" && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalData.action === "buy" ? "Buy Stock" : "Sell Stock"}
            </h2>
            <input
              type="number"
              placeholder="Quantity"
              className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
            />
            <div className="text-red-400 mb-4">{error}</div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
  
{/* Toast Notification */}
<ToastContainer />


      {/* Ticker */}
      <div className="absolute bottom-0 left-0 w-full bg-black py-2 overflow-hidden">
        <div className="text-white font-semibold text-xl whitespace-nowrap animate-marquee">
          {/* Scroll the stocks */}
          {stocks.map((stock) => {
            const currentTotalAmount = stock.quantity * stock.price;
            const initialTotalAmount = stock.initialQuantity * stock.initialPrice; 
            const percentageChange = 
              ((currentTotalAmount - initialTotalAmount) / initialTotalAmount) * 100; 

            const isPositive = percentageChange >= 0;

            return (
              <span key={stock._id} className="mr-8">
               {stock.name} - ${stock.price} - Qty: {stock.quantity} (
                <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {isPositive ? "+" : ""} {percentageChange.toFixed(2)}%
                </span>
               )
             </span>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default StockTable;