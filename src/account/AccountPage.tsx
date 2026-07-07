import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import './AccountPage.css'

interface MeResponse {
  user: {
    id: string
    displayName: string | null
    status: string
  }
  contacts: Array<{
    type: string
    value: string
    isVerified: boolean
  }>
}

interface Address {
  id: string
  label: string
  city: string
  street: string
  building: string
  entrance?: string
  floor?: string
  apartment?: string
  comment?: string
  isDefault: boolean
}

interface Favorite {
  id: string
  sku: string
  createdAt: string
}

interface Order {
  id: string
  externalOrderId: string | null
  totalAmount: string
  currency: string
  status: string
  placedAt: string
}

interface Consent {
  id: string
  consentType: string
  documentVersion: string
  granted: boolean
  grantedAt: string
  revokedAt: string | null
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? 'REQUEST_FAILED')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function AccountPage() {
  const [me, setMe] = useState<MeResponse | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [consents, setConsents] = useState<Consent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [debugCode, setDebugCode] = useState<string | null>(null)
  const [marketingConsent, setMarketingConsent] = useState(false)

  const [profileName, setProfileName] = useState('')
  const [addressLabel, setAddressLabel] = useState('Дом')
  const [addressCity, setAddressCity] = useState('Краснодар')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressBuilding, setAddressBuilding] = useState('')

  const loadDashboard = async () => {
    const [meData, ordersData, favoritesData, addressesData, consentsData] = await Promise.all([
      api<MeResponse>('/api/me'),
      api<{ items: Order[] }>('/api/me/orders'),
      api<{ items: Favorite[] }>('/api/me/favorites'),
      api<{ items: Address[] }>('/api/me/addresses'),
      api<{ items: Consent[] }>('/api/me/consents'),
    ])

    setMe(meData)
    setOrders(ordersData.items)
    setFavorites(favoritesData.items)
    setAddresses(addressesData.items)
    setConsents(consentsData.items)
    setProfileName(meData.user.displayName ?? '')
  }

  useEffect(() => {
    loadDashboard()
      .catch(() => setMe(null))
      .finally(() => setLoading(false))
  }, [])

  const requestOtp = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    try {
      const response = await api<{ challengeId: string; debugCode?: string }>('/api/auth/start', {
        method: 'POST',
        body: JSON.stringify({ channel: 'sms', phone }),
      })

      setChallengeId(response.challengeId)
      setDebugCode(response.debugCode ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить код')
    }
  }

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault()
    if (!challengeId) return
    setError(null)

    try {
      await api('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          challengeId,
          code: otpCode,
          displayName,
          marketingConsent,
        }),
      })

      setChallengeId(null)
      setOtpCode('')
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось подтвердить код')
    }
  }

  const updateProfile = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    try {
      await api('/api/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName: profileName }),
      })
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить профиль')
    }
  }

  const addAddress = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    try {
      await api('/api/me/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label: addressLabel,
          city: addressCity,
          street: addressStreet,
          building: addressBuilding,
          isDefault: addresses.length === 0,
        }),
      })
      setAddressStreet('')
      setAddressBuilding('')
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось добавить адрес')
    }
  }

  const requestExport = async () => {
    setError(null)

    try {
      const payload = await api<Record<string, unknown>>('/api/me/privacy/export', {
        method: 'POST',
      })
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'marconi-account-export.json'
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось экспортировать данные')
    }
  }

  const requestDeletion = async () => {
    setError(null)

    try {
      await api('/api/me/privacy/delete', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      alert('Запрос на удаление данных зарегистрирован.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить запрос')
    }
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setMe(null)
    setOrders([])
    setFavorites([])
    setAddresses([])
    setConsents([])
  }

  if (loading) {
    return <div className="account-shell"><p className="account-loading">Загружаем личный кабинет…</p></div>
  }

  return (
    <div className="account-shell">
      <div className="account-bg account-bg--top" aria-hidden="true" />
      <div className="account-bg account-bg--bottom" aria-hidden="true" />
      <main className="account container">
        <div className="account-topbar">
          <a href="/" className="account-back">На главную</a>
          {me ? <button className="account-logout" onClick={logout}>Выйти</button> : null}
        </div>

        <header className="account-hero">
          <p className="account-kicker">Личный кабинет</p>
          <h1>{me ? `Здравствуйте, ${me.user.displayName ?? 'гость'}` : 'Безопасный вход в Маркони'}</h1>
          <p>
            Вход по коду без пароля, управление заказами и согласиями, экспорт и удаление данных
            без лишнего сбора персональной информации.
          </p>
        </header>

        {error ? <p className="account-error">{error}</p> : null}

        {!me ? (
          <section className="account-grid">
            <form className="account-card" onSubmit={requestOtp}>
              <h2>Шаг 1. Получить код</h2>
              <label>
                Телефон
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 (___) ___-__-__" />
              </label>
              <label>
                Как к вам обращаться
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Иван" />
              </label>
              <label className="account-checkbox">
                <input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} />
                Хочу получать новости и акции Маркони
              </label>
              <button className="btn btn--primary" type="submit">Получить SMS-код</button>
              <p className="account-note">
                Продакшен-версия должна работать только через локализованный в РФ контур обработки ПДн.
              </p>
            </form>

            <form className="account-card" onSubmit={verifyOtp}>
              <h2>Шаг 2. Подтвердить вход</h2>
              <label>
                Код из SMS
                <input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} placeholder="123456" />
              </label>
              {challengeId ? <p className="account-note">challengeId: {challengeId}</p> : null}
              {debugCode ? <p className="account-note">Dev OTP: {debugCode}</p> : null}
              <button className="btn btn--primary" type="submit" disabled={!challengeId}>Войти</button>
            </form>
          </section>
        ) : (
          <div className="account-grid">
            <section className="account-card">
              <h2>Профиль</h2>
              <form onSubmit={updateProfile} className="account-stack">
                <label>
                  Имя
                  <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
                </label>
                <div className="account-list">
                  {me.contacts.map((contact) => (
                    <div key={`${contact.type}-${contact.value}`} className="account-row">
                      <span>{contact.type}</span>
                      <strong>{contact.value}</strong>
                    </div>
                  ))}
                </div>
                <button className="btn btn--primary" type="submit">Сохранить профиль</button>
              </form>
            </section>

            <section className="account-card">
              <h2>Адреса</h2>
              <form onSubmit={addAddress} className="account-stack">
                <label>
                  Название
                  <input value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} />
                </label>
                <label>
                  Город
                  <input value={addressCity} onChange={(event) => setAddressCity(event.target.value)} />
                </label>
                <label>
                  Улица
                  <input value={addressStreet} onChange={(event) => setAddressStreet(event.target.value)} />
                </label>
                <label>
                  Дом
                  <input value={addressBuilding} onChange={(event) => setAddressBuilding(event.target.value)} />
                </label>
                <button className="btn btn--primary" type="submit">Добавить адрес</button>
              </form>
              <div className="account-list">
                {addresses.length === 0 ? <p className="account-empty">Адресов пока нет.</p> : null}
                {addresses.map((address) => (
                  <div key={address.id} className="account-row">
                    <span>{address.label}</span>
                    <strong>{address.city}, {address.street}, {address.building}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="account-card">
              <h2>Заказы и избранное</h2>
              <div className="account-list">
                <p className="account-subhead">Заказы</p>
                {orders.length === 0 ? <p className="account-empty">История заказов появится после интеграции с системой заказов.</p> : null}
                {orders.map((order) => (
                  <div key={order.id} className="account-row">
                    <span>{new Date(order.placedAt).toLocaleDateString('ru-RU')}</span>
                    <strong>{order.totalAmount} {order.currency}</strong>
                  </div>
                ))}
                <p className="account-subhead">Избранное</p>
                {favorites.length === 0 ? <p className="account-empty">Избранное пока пусто.</p> : null}
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="account-row">
                    <span>SKU</span>
                    <strong>{favorite.sku}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="account-card">
              <h2>Приватность и согласия</h2>
              <div className="account-list">
                {consents.map((consent) => (
                  <div key={consent.id} className="account-row">
                    <span>{consent.consentType}</span>
                    <strong>{consent.documentVersion}</strong>
                  </div>
                ))}
              </div>
              <div className="account-actions">
                <button className="btn btn--outline" type="button" onClick={requestExport}>Экспорт данных</button>
                <button className="btn btn--outline" type="button" onClick={requestDeletion}>Удалить аккаунт</button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
