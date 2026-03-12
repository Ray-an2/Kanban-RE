import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface FormData {
  pseudo: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  pseudo?: string;
  password?: string;
  confirmPassword?: string;
  api?: string;
}

const Inscription: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    password: '',
    confirmPassword: '',
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
    } else if (formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit faire au moins 3 caractères';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
          confirmPassword: '',
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
          <button type="button" className="login-button" onClick={handleGoToLogin}>
            Se connecter
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="inscription-form">
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="show-password">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Afficher les mots de passe
            </label>
          </div>

          <button type="submit" className="submit-button">
            S'inscrire
          </button>

          {errors.api && <div className="api-error-message">{errors.api}</div>}
        </form>
      )}
    </div>
  );
};

export default Inscription;
