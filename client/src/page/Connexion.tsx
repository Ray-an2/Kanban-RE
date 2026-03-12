import React, { useState } from 'react';
import type {ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface FormData {
  pseudo: string;
  password: string;
}

interface FormErrors {
  pseudo?: string;
  password?: string;
  api?: string;
}

const Connexion: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Connexion en cours avec :', formData);

        // Simulation d'un appel API
        // const response = await axios.post('https://ton-api.com/login', formData);
        // if (response.status === 200) {
        //   setIsSubmitted(true);
        //   // Rediriger vers une page protégée après la connexion
        //   navigate('/tableau');
        // }

        // Pour l'exemple, on simule une connexion réussie
        setIsSubmitted(true);
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        setErrors({ ...errors, api: 'Pseudo ou mot de passe incorrect.' });
      }
    }
  };

  return (
    <div className="connexion-container">
      <div className="header">
        <h1>Connexion</h1>
      </div>

      {isSubmitted ? (
        <div className="success-message">
          <h2>Connexion réussie !</h2>
          <p>Redirection en cours...</p>
          {/* Redirection automatique après 2 secondes */}
          {setTimeout(() => navigate('/tableau'), 2000)}
        </div>
      ) : (
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
            />
            {errors.pseudo && <span className="error-message">{errors.pseudo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Entrez votre mot de passe"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
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

          <button type="submit" className="submit-button">
            Se connecter
          </button>

          {errors.api && <div className="api-error-message">{errors.api}</div>}

          <div className="register-link">
            <p>Vous n'avez pas de compte ?</p>
            <button type="button" className="link-button" onClick={() => navigate('/inscription')}>
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
      )}
    </div>
  );
};

export default Connexion;
