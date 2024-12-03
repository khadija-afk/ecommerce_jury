import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axiosConfig";
import "./UserOrders.css";

interface Article {
  name: string;
  photo: string[];
}

interface OrderItem {
  id: number;
  Article: Article;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  OrderItems: OrderItem[];
}

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Order[]>("/api/order/orders", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
        setError("Impossible de charger vos commandes. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProceedToPayment = (orderId: number, total: number) => {
    navigate(`/checkout/${orderId}`, { state: { total } });
  };

  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const response = await apiClient.get(`/api/order/order/${orderId}/invoice`, {
        responseType: "blob", // Important pour traiter un fichier binaire (PDF)
        withCredentials: true,
      });

      // Créez une URL pour le blob reçu
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Créez un lien temporaire pour déclencher le téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`); // Nom du fichier
      document.body.appendChild(link);
      link.click();

      // Nettoyez le lien après téléchargement
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement de la facture :", error);
      alert("Impossible de télécharger la facture. Veuillez réessayer plus tard.");
    }
  };

  if (loading) return <p>Chargement de vos commandes...</p>;
  if (error) return <p>{error}</p>;
  if (!orders.length) return <p>Vous n'avez pas encore passé de commande.</p>;

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <div>
              <p>
                <strong>Commande effectuée le :</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total :</strong> {order.total} €
              </p>
              <p>
                <strong>Statut :</strong> {order.status}
              </p>
            </div>
            <div>
              <p>
                <strong>N° de commande :</strong> {order.id}
              </p>
            </div>
          </div>

          <div className="order-items">
            {order.OrderItems.map((item) => (
              <div className="order-item" key={item.id}>
                <img
                  src={item.Article.photo[0]}
                  alt={item.Article.name}
                  className="product-photo"
                />
                <div>
                  <p>
                    <strong>{item.Article.name}</strong>
                  </p>
                  <p>Prix : {item.price} €</p>
                  <p>Quantité : {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-actions">
            {order.status === "Validé" ? (
              <button
                className="action-button"
                onClick={() => handleDownloadInvoice(order.id)}
              >
                Télécharger la facture
              </button>
            ) : (
              <button
                className="action-button"
                onClick={() => handleProceedToPayment(order.id, order.total)}
              >
                Procéder au paiement
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
