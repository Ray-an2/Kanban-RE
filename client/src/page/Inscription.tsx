import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../page/App.css';
import type { APIResponse } from '../model/api.ts';
import { isUser } from '../model/auth.ts';

const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  pseudo: string;
  motDePasse: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  pseudo?: string;
  motDePasse?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  api?: string;
}

const Inscription: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    motDePasse: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.pseudo.trim()) {
      newErrors.pseudo = 'Le pseudo est requis';
      isValid = false;
    } else if (formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit faire au moins 3 caractères';
      isValid = false;
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit faire au moins 6 caractères';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
      isValid = false;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo: formData.pseudo,
          motDePasse: formData.motDePasse,
          email: formData.email,
          nom: formData.lastName,
          prenom: formData.firstName,
        }),
      });

      const json = (await res.json()) as APIResponse<unknown>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? `HTTP ${res.status}` : json.error.message);
      }

      if (!isUser(json.data)) {
        throw new Error('Format de reponse invalide');
      }

      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setErrors((prev) => ({
        ...prev,
        api: error instanceof Error ? error.message : "Erreur d'inscription",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="header">
        <h1>Inscription</h1>
        <Link className="poll-back-link" to={`/`}>
          Revenir au choix des sondages
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="inscription-form">
        {/* Champ Pseudo */}
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo*</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            className={errors.pseudo ? 'error' : ''}
            placeholder="Entrez votre pseudo"
            required
          />
          {errors.pseudo && <span className="error-message">{errors.pseudo}</span>}
        </div>

        {/* Champ Email */}
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Entrez votre email"
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Champ Mot de passe */}
        <div className="form-group">
          <label htmlFor="motDePasse">Mot de passe*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="motDePasse"
            name="motDePasse"
            value={formData.motDePasse}
            onChange={handleChange}
            className={errors.motDePasse ? 'error' : ''}
            placeholder="Entrez votre mot de passe"
            required
          />
          {errors.motDePasse && <span className="error-message">{errors.motDePasse}</span>}
        </div>

        {/* Champ Prénom */}
        <div className="form-group">
          <label htmlFor="firstName">Prénom*</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'error' : ''}
            placeholder="Entrez votre prénom"
            required
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        {/* Champ Nom */}
        <div className="form-group">
          <label htmlFor="lastName">Nom*</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'error' : ''}
            placeholder="Entrez votre nom"
            required
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        {/* Affichage/masquage du mot de passe */}
        <div className="show-password">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Afficher le mot de passe
          </label>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creation...' : 'Creer un compte'}
        </button>

        {errors.api && <div className="api-error-message">{errors.api}</div>}

        <div className="login-link">
          <p>Vous avez déjà un compte ?</p>
          <button type="button" className="link-button" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inscription;
