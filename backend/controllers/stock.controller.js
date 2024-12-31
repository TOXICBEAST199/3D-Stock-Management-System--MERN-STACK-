import stock from '../models/stock.model.js';

// 1) API - to display all stocks
export const getstocks = async (req, res) => {
    try {
        const stocks = await stock.find({});
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2) API - to display stock using its id
export const getstock = async (req, res) => {
    try {
        const { id } = req.params;
        const singleStock = await stock.findById(id);
        res.status(200).json(singleStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3) API - to create a stock
export const createstock = async (req, res) => {
    try {
        const newStock = await stock.create(req.body);
        res.status(200).json(newStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//4) API - to UPDATE and existing STOCK

export const updatestock = async (req, res) => {
    try {
        const { id } = req.params;

        // Pass { new: true } to return the updated stock document
        const updatedStock = await stock.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock Not Found!' });
        }

        // Return the updated stock document
        res.status(200).json(updatedStock);
    } catch (error) {
        console.error("Error occurred during update:", error);
        res.status(500).json({ message: error.message });
    }
};

// 5) API - to delete a stock from the DB
export const deletestock = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStock = await stock.findByIdAndDelete(id);

        if (!deletedStock) {
            return res.status(404).json({ message: 'Stock Not Found!' });
        }

        res.status(200).json(deletedStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};