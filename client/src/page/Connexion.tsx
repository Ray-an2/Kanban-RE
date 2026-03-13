import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import type { APIResponse } from '../model/api.ts';
import { isAuthResponse } from '../model/auth.ts';
import { useAuth } from '../hooks/useAuth.ts';

const API_URL = import.meta.env.VITE_API_URL;

interface FormData {
  pseudo: string;
  motDePasse: string;
}

interface FormErrors {
  pseudo?: string;
  motDePasse?: string;
  api?: string;
}

const Connexion: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    motDePasse: '',
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
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrors({});
      try {
        const res = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pseudo: formData.pseudo,
            motDePasse: formData.motDePasse,
          }),
        });

        const json = (await res.json()) as APIResponse<unknown>;
        if (!res.ok || !json.success) {
          throw new Error(json.success ? `HTTP ${res.status}` : json.error.message);
        }

        if (!isAuthResponse(json.data)) {
          throw new Error('Format de reponse invalide');
        }

        login(json.data);
        navigate('/tableau');
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        setErrors((prev) => ({
          ...prev,
          api: error instanceof Error ? error.message : 'Erreur de connexion.',
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="connexion-container">
      <div className="header">
        <h1>Connexion</h1>
      </div>

      <form onSubmit={handleSubmit} className="connexion-form">
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo</label>
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

        <div className="form-group">
          <label htmlFor="motDePasse">Mot de passe</label>
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
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {errors.api && <div className="api-error-message">{errors.api}</div>}

        <div className="register-link">
          <p>Vous n'avez pas de compte ?</p>
          <button type="button" className="link-button" onClick={() => navigate('/auth/inscription')}>
            S'inscrire
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/')}
          >
            Retour au Kanban
          </button>
        </div>
      </form>
    </div>
  );
};

export default Connexion;
