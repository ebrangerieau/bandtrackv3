const BASE = '/api'

async function req(method, path, body) {
  const opts = { method, credentials: 'include', headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const r = await fetch(BASE + path, opts)
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: 'Erreur réseau' }))
    const e = new Error(err.error || 'Erreur')
    e.status = r.status
    e.data = err
    throw e
  }
  return r.json()
}

export const getMe           = ()            => req('GET',  '/me')
export const login           = (name, pw)    => req('POST', '/login',    { name, password: pw })
export const logout          = ()            => req('POST', '/logout')
export const register        = (name, pw)    => req('POST', '/register', { name, password: pw })

export const getGroup        = ()            => req('GET',  '/group')
export const updateGroup     = (name)        => req('PUT',  '/group',    { name })
export const getMembers      = ()            => req('GET',  '/members')

export const getSongs        = (status)      => req('GET',  '/songs' + (status ? `?status=${status}` : ''))
export const getSong         = (id)          => req('GET',  `/songs/${id}`)
export const createSong      = (data)        => req('POST', '/songs',    data)
export const updateSong      = (id, data)    => req('PUT',  `/songs/${id}`, data)
export const deleteSong      = (id)          => req('DELETE', `/songs/${id}`)
export const updateMyLevel   = (id, level)   => req('PUT',  `/songs/${id}/level`, { level })
export const updatePersonalNotes = (id, notes) => req('PUT', `/songs/${id}/personal-notes`, { notes })
export const updateCollectiveNote = (id, text) => req('PUT', `/songs/${id}/collective-note`, { text })

export const getGigs         = ()            => req('GET',  '/gigs')
export const createGig       = (data)        => req('POST', '/gigs',     data)
export const updateGig       = (id, data)    => req('PUT',  `/gigs/${id}`, data)
export const deleteGig       = (id)          => req('DELETE', `/gigs/${id}`)

export const getActivity     = ()            => req('GET',  '/activity')
