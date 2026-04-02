import React, { useState, useEffect, useContext } from 'react';
import { addDoc, collection, doc, getDoc, query, updateDoc, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Context/user.context';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const productForm = {
  name: '',
  price: '',
  unit: '',
  description: '',
  productURL: '',
  category: 'fruits',
  stock: '',
  discountPrice: ''
};

const Dashboard = ({ user }) => {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(productForm);
  const { name, price, unit, description, productURL, category, stock, discountPrice } = form;
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(UserContext);
  const [orderItem, setOrderItem] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [farm, setFarm] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const getFarm = async () => {
    const docRef = doc(db, 'farm', user.uid);
    const docSnap = await getDoc(docRef);
    setFarm(docSnap.data());
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getItemData = () => {
    const q = query(collection(db, 'orders'), where('farm', '==', user.uid));
    onSnapshot(q, (docSnap) => {
      let pro = [];
      let p = [];
      let c = [];
      docSnap.forEach((doc) => {
        pro.push({ id: doc.id, ...doc.data() });
      });
      setOrderItem(pro);
      pro.forEach((doc) => {
        if (doc.completed) {
          c.push(doc);
        } else {
          p.push(doc);
        }
      });
      setPending(p);
      setCompleted(c);
    });
  };

  useEffect(() => {
    getItemData();
    getFarm();
    // eslint-disable-next-line
  }, [user]);

  const getProduct = () => {
    const q = query(collection(db, 'product'), where('farm', '==', user.uid));
    onSnapshot(q, (docSnap) => {
      let pro = [];
      docSnap.forEach((doc) => {
        pro.push({ id: doc.id, ...doc.data() });
      });
      setProducts(pro);
    });
  };

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, [user]);

  const uploadProduct = async (e) => {
    e.preventDefault();
    if (isUploading) return toast.info("Please wait for the image to finish uploading.");

    if (!productURL) {
      return toast.error("Please upload a product image first.");
    }

    try {
      const docRef = collection(db, 'product');
      await addDoc(docRef, {
        name,
        price: parseInt(price),
        unit,
        description,
        productURL,
        farm: currentUser.uid,
        category,
        stock: parseInt(stock),
        discountPrice: parseInt(discountPrice) || 0,
        likedBy: 0
      });
      toast.success("Product successfully added to marketplace!");
      setForm(productForm);
      setFile(null);
    } catch (err) {
      toast.error("Failed to add product: " + err.message);
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "ebazar");
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dig8ykh9p");

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dig8ykh9p"}/image/upload`, {
          method: "POST",
          body: data,
        });
        const uploadedImage = await res.json();
        setForm((prev) => ({ ...prev, productURL: uploadedImage.url }));
        toast.success('Image successfully uploaded to cloud.');
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image.");
      }
      setIsUploading(false);
    };
    if (file) {
      uploadFile();
    }
  }, [file]);

  const handleRowClick = (order) => setSelectedOrder(order);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product from the marketplace?')) {
      await deleteDoc(doc(db, 'product', id));
      toast.success('Product deleted successfully');
    }
  };

  const handleReq = async (orderId) => {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, {
      reqConfirm: true
    });
    toast.success("Delivery request sent to user!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Stats */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Pending Orders</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{pending.length}</h1>
            </div>
            <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <AccessTimeIcon fontSize="large" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Completed Orders</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{completed.length}</h1>
            </div>
            <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <BeenhereIcon fontSize="large" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-gray-500 font-medium text-sm">Total Earnings</p>
              <h1 className="text-4xl font-extrabold text-green-600 mt-1">Rs. {farm?.earning || 0}</h1>
            </div>
            <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CurrencyRupeeIcon fontSize="large" />
            </div>
          </div>
        </div>

        {/* Manage Products Section */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <Inventory2Icon className="text-green-600" /> Add New Product
            </h2>
            <form onSubmit={uploadProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Product Name</label>
                  <input type="text" name="name" value={name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="e.g. Organic Tomatoes" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Price (Rs.)</label>
                  <input type="number" name="price" value={price} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="50" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Unit of Sale</label>
                  <input type="text" name="unit" value={unit} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="kg, gram, piece" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                  <input type="number" name="stock" value={stock} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="100" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Discounted Price For Members (Optional)</label>
                  <input type="number" name="discountPrice" value={discountPrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Leave empty if none" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Product Category</label>
                  <select name="category" value={category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all">
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy Products</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea name="description" value={description} onChange={handleChange} required rows="3" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Freshly handpicked..." />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Product Image URL</label>
                  <div className="flex border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  </div>
                  {isUploading && <p className="text-xs text-amber-500 font-bold mt-2">Uploading image to cloud...</p>}
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full py-4 px-6 rounded-xl text-white font-bold bg-green-600 hover:bg-green-700 transition duration-200 shadow-md">
                Publish Product to Marketplace
              </button>
            </form>
          </div>

          {/* Active Listings Sidebar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col h-[700px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Listings</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {products && products.length > 0 ? (
                products.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-2xl items-center hover:shadow-md transition-shadow">
                    <img src={item.productURL} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">Rs. {item.price} / {item.unit}</p>
                      <p className="text-xs text-green-600 font-semibold mt-1">Stock: {item.stock || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p>No products listed yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Pending Order Fulfilment</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-6">Product</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Qty</th>
                  <th className="p-6">Total</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.length > 0 ? (
                  pending.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-bold text-gray-900">{order.name}</td>
                      <td className="p-6 text-gray-600">
                        {order.userName}
                        <button onClick={() => handleRowClick(order)} className="block text-xs text-green-600 hover:underline mt-1">View Details</button>
                      </td>
                      <td className="p-6 text-gray-600">{order.quantity} {order.unit}</td>
                      <td className="p-6 text-gray-900 font-semibold">Rs. {order.price}</td>
                      <td className="p-6 text-center">
                        {order.reqConfirm ? (
                          <span className="text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">Request Sent...</span>
                        ) : (
                          <button
                            onClick={() => handleReq(order.id)}
                            className="bg-green-100 text-green-700 hover:bg-green-200 font-bold py-2 px-4 rounded-xl text-sm transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500 font-medium">All caught up! No pending orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold">✕</button>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Customer</span>
                <span className="text-gray-900 font-bold">{selectedOrder.userName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="text-gray-900 font-medium">{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-green-600 font-bold">Rs. {selectedOrder.price}</span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 font-medium block mb-2">Delivery Address</span>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {selectedOrder.address}, {selectedOrder.state || ''}
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-full mt-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;