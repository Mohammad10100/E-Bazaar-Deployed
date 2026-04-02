import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrdersPage = ({ user }) => {
    const [orders, setOrders] = useState([]);

    const getOrders = () => {
        const q = query(collection(db, 'orders'), where('userCart', '==', user.uid));
        onSnapshot(q, (docSnap) => {
            const pro = [];
            docSnap.forEach((doc) => {
                pro.push({ id: doc.id, ...doc.data() });
            });
            setOrders(pro);
        });
    };

    useEffect(() => {
        getOrders();
        // eslint-disable-next-line
    }, [])

    const handleReq = async (orderId) => {
        const docRef = doc(db, "orders", orderId);
        await updateDoc(docRef, {
            completed: true,
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <AssignmentIcon />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Your Orders</h1>
                        <p className="text-gray-500 mt-1">Track the status of your recent farm purchases.</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                    {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Product</th>
                                        <th className="p-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Details</th>
                                        <th className="p-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                                        <th className="p-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Total Price</th>
                                        <th className="p-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-6">
                                                <img
                                                    src={order.productURL}
                                                    alt={order.name}
                                                    className="w-20 h-20 object-cover rounded-2xl shadow-sm"
                                                />
                                            </td>
                                            <td className="p-6 font-bold text-gray-900 text-lg">{order.name}</td>
                                            <td className="p-6 text-gray-600 font-medium">{order.quantity} {order.unit}</td>
                                            <td className="p-6 text-green-600 font-extrabold text-lg">Rs. {order.price}</td>
                                            <td className="p-6 text-center">
                                                {order.completed ? (
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-700">
                                                        <CheckCircleOutlineIcon fontSize="small" /> Received
                                                    </span>
                                                ) : (
                                                    order.reqConfirm ? (
                                                        <button
                                                            onClick={() => handleReq(order.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
                                                        >
                                                            Confirm Received
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex px-4 py-2 rounded-xl text-sm font-bold bg-amber-100 text-amber-700">
                                                            Pending Dispatch
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-24 text-center px-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-300">
                                <AssignmentIcon fontSize="large" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
                            <p className="text-gray-500 max-w-sm mx-auto">You haven't purchased any fresh produce yet. Head back to the marketplace to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrdersPage