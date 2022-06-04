import { useState, useEffect } from "react";
import { db } from "../Firebase/firebase.Config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
/*
custom hook used to get delivery  orders of today's date 
e
*/
export const useProfileOrdersHook = () => {
  const [documents, setDocuments] = useState([]);
  const [row, setRow] = useState([]);
  useEffect(() => {
    const updatedOrder = [...row];

    onSnapshot(
      collection(db, "orders"),
      where("orderType", "==", "deliver"),
      (snapshot) => {
        setDocuments(
          snapshot.docs.map((document) => {
            let temp = {
              id: document.id,
              date: document.data().orderDate,
              time: document.data().orderTime,
              totalPrice: document.data().cartTotal,
              status: document.data().status,
              orders: document.data().orders,
              notes: document.data().notes,
              userData: document.data().dataUser,
              orderType: document.data().orderType,
              shippingFee: document.data().shippingFee,
            };
            const updatedItemIndex = updatedOrder.findIndex(
              (item) => item.id === temp.id
            );

            if (updatedItemIndex < 0) {
              updatedOrder.push(temp);
            } else {
              const updatedItem = {
                ...updatedOrder[updatedItemIndex],
              };
              updatedOrder[updatedItemIndex] = updatedItem;
            }
            setRow(updatedOrder);
          })
        );
      }
    );
  }, []);

  return [row, row.length];
};
