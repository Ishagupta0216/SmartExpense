import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { supabase } from '../lib/supabase.js';
import styles from './Auth.module.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      toast.error(signUpError.message);
      return;
    }

    if (data.session) {
      navigate('/dashboard', { replace: true });
      return;
    }

    setMessage('Check your email to confirm your account, then log in.');
    toast.success('Check your email to confirm your account.');
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.brand}>S</span>
          <div>
            <p>Create account</p>
            <h1>SmartExpense</h1>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.message}>{message}</p> : null}
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Signup'}
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
