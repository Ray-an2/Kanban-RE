import React, { useState } from 'react';
import type {ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import '../page/App.css';

interface FormData {
  pseudo: string;
  password: string;
  email: string;
  firstName?: string;  // Optionnel
  lastName?: string;   // Optionnel
}

interface FormErrors {
  pseudo?: string;
  password?: string;
  email?: string;
  api?: string;
}

const Inscription: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
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

    // Validation du pseudo
    if (!formData.pseudo.trim()) {
      newErrors.pseudo = 'Le pseudo est requis';
      isValid = false;
    } else if (formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit faire au moins 3 caractères';
      isValid = false;
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
      isValid = false;
    }

    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Formulaire valide, données soumises :', formData);
        setIsSubmitted(true);
        setFormData({
          pseudo: '',
          password: '',
          email: '',
          firstName: '',
          lastName: '',
        });
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        setErrors({ ...errors, api: 'Une erreur est survenue lors de l\'inscription.' });
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/connexion');
  };

  return (
    <div className="inscription-container">
      <div className="header">
        <h1>Inscription</h1>
      </div>

      {isSubmitted ? (
        <div className="success-message">
          <h2>Inscription réussie !</h2>
          <p>Bienvenue, {formData.pseudo} !</p>
          <button  type="button" className="login-button" onClick={handleGoToLogin}>
            Se connecter
          </button>
        </div>
      ) : (
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
            <label htmlFor="password">Mot de passe*</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Entrez votre mot de passe"
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Champ Prénom (optionnel) */}
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              placeholder="Entrez votre prénom (optionnel)"
            />
          </div>

          {/* Champ Nom (optionnel) */}
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              placeholder="Entrez votre nom (optionnel)"
            />
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

          {/* Bouton de soumission */}
          <button type="submit" className="submit-button">
            S'inscrire
          </button>

          {/* Message d'erreur API */}
          {errors.api && <div className="api-error-message">{errors.api}</div>}

          {/* Lien vers la page de connexion */}
          <div className="login-link">
            <p>Vous avez déjà un compte ?</p>
            <button type="button" className="link-button" onClick={handleGoToLogin}>
              Se connecter
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inscription;
