import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";
import "./profil.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState<User | {}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<User>("/api/user/profil", {
          withCredentials: true,
        });
        setUser(response.data);
        setUpdatedData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil utilisateur :", err);
        setError("Impossible de charger le profil utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.put<{ user: User }>(
        "/api/user/updateProfil",
        updatedData,
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            name="firstName"
            value={(updatedData as User).firstName || ""}
            onChange={handleInputChange}
            placeholder="Prénom"
          />
          <input
            type="text"
            name="lastName"
            value={(updatedData as User).lastName || ""}
            onChange={handleInputChange}
            placeholder="Nom"
          />
          <input
            type="email"
            name="email"
            value={(updatedData as User).email || ""}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <button className="profile-button save" onClick={handleSave} title="Enregistrer">
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      ) : (
        <div className="profile-details">
          <p>
            <strong>Nom :</strong> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <strong>Email :</strong> {user?.email}
          </p>
          <button
            className="profile-button edit"
            onClick={() => setIsEditing(true)}
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
