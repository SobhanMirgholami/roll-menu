import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import CafeLogo from '../components/CafeLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')
    setLoading(true)

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) {
        setError('ورود انجام نشد؛ ایمیل و رمز را بررسی کن.')
        return
      }

      navigate('/admin', { replace: true })
    } catch {
      setError('ارتباط برقرار نشد؛ دوباره امتحان کن.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main dir="rtl" className="page login-page">
      <form
        onSubmit={handleSubmit}
        className="glass login-form"
      >
        <header className="login-heading">
          <CafeLogo />

          <h1 className="login-title">
            ورود به مدیریت کافه رول
          </h1>

          <p className="login-description">
            با حساب مدیر وارد شوید
          </p>
        </header>

        <label className="field">
          <span>ایمیل</span>

          <input
            required
            type="email"
            dir="ltr"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@gmail.com"
            className="input"
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>رمز عبور</span>

          <input
            required
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            disabled={loading}
          />
        </label>

        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>

        <Link to="/" className="login-back">
          بازگشت به منو
        </Link>
      </form>
    </main>
  )
}