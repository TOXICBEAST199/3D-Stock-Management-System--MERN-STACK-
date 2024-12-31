import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(  {
  name: {
    type: String,
    required: [true, "Please Enter an Valid Product Name!"],
    default: "",
  },

  quantity: {
    type: Number,
    required: [true, "Please Enter a Valid Quantity"],
    default: 0,
  },

  price: {
    type: Number,
    required: [true, "Please Enter Valid Price"],
    default: 0,
  },
},
//   {
//     timestamps: true,
//   }
);


const stock = mongoose.model('Stock', stockSchema);

export default stock;
