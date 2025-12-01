"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserLogin() {
	const router = useRouter()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [pressed, setPressed] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			})

			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || res.statusText)
			}

			const data = await res.json()
			if (data && data.token) {
				try {
					localStorage.setItem('k_system_user_token', data.token)
					localStorage.setItem('k_system_user', data.username)
				} catch (err) {
					console.error('failed to save token', err)
				}
				router.replace('/sites')
				return
			}

			throw new Error('Invalid response from server')
		} catch (err: any) {
			setError(err?.message || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={styles.page}>
			<div style={styles.overlay} />
			<main style={styles.card}>
				<div style={styles.brand}>
					<h1 style={{
						margin: 0,
						fontSize: 34,
						color: '#1f2937',
						fontWeight: 800,
						textShadow: '0 2px 4px rgba(255, 255, 255, 0.8), 0 4px 8px rgba(0, 0, 0, 0.1)',
						letterSpacing: '-0.5px'
					}}>K Energy Save</h1>
					<p style={{
						margin: '10px 0 0 0',
						fontSize: 15,
						color: '#6b7280',
						fontWeight: 600,
						letterSpacing: '0.3px',
						textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)'
					}}>User Login</p>
				</div>

				<form onSubmit={handleSubmit} style={styles.form}>
					<label style={styles.label}>
						Username
						<input
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							style={styles.input}
							type="text"
							autoComplete="username"
						/>
					</label>

					<label style={styles.label}>
						Password
						<input
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							style={styles.input}
							type="password"
							autoComplete="current-password"
						/>
					</label>

					{error && <div style={styles.error}>{error}</div>}

					<button
						type="submit"
						style={{
							...styles.button,
							transform: pressed ? 'translateY(1px) scale(.997)' : 'translateY(0)',
							boxShadow:
								pressed
									? '0 4px 12px rgba(2,6,23,0.6), inset 0 -2px 0 rgba(0,0,0,0.18)'
									: '0 10px 28px rgba(2,6,23,0.7), 0 2px 6px rgba(124,58,237,0.12), inset 0 -2px 0 rgba(255,255,255,0.03)'
						}}
						disabled={loading}
						onPointerDown={() => setPressed(true)}
						onPointerUp={() => setPressed(false)}
						onPointerLeave={() => setPressed(false)}
					>
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>

				<footer style={styles.footer}>
					<small style={{ color: '#6b7280', fontSize: 13 }}>K Energy Save co., Ltd • {new Date().getFullYear()}</small>
				</footer>
			</main>
		</div>
	)
}

const styles: { [k: string]: React.CSSProperties } = {
	page: {
		minHeight: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		backgroundImage: 'linear-gradient(135deg, #374151 0%, #4b5563 25%, #6b7280 50%, #9ca3af 100%)',
		backgroundSize: 'cover',
		padding: 32,
		boxSizing: 'border-box'
	},
	overlay: {
		position: 'absolute',
		inset: 0,
		background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15), rgba(0,0,0,0.3))',
		pointerEvents: 'none'
	},
	card: {
		width: '100%',
		maxWidth: 520,
		background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
		border: '1px solid rgba(209, 213, 219, 0.6)',
		borderRadius: 20,
		padding: 48,
		position: 'relative',
		boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(75, 85, 99, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
		color: '#1f2937',
		backdropFilter: 'blur(10px)'
	},
	brand: {
		textAlign: 'center',
		marginBottom: 32
	},
	form: {
		display: 'grid',
		gap: 20
	},
	label: {
		display: 'block',
		fontSize: 14,
		fontWeight: 600,
		color: '#374151',
		textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
	},
	input: {
		width: '100%',
		marginTop: 8,
		padding: '14px 18px',
		borderRadius: 10,
		border: '2px solid #d1d5db',
		background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
		color: '#111827',
		fontSize: 15,
		transition: 'all 0.2s ease',
		outline: 'none',
		boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(255, 255, 255, 0.8)'
	},
	button: {
		marginTop: 12,
		padding: '16px 24px',
		borderRadius: 10,
		border: 'none',
		background: 'linear-gradient(145deg, #4b5563, #374151)',
		color: '#ffffff',
		fontWeight: 700,
		fontSize: 16,
		cursor: 'pointer',
		letterSpacing: '0.5px',
		boxShadow: '0 6px 20px rgba(75, 85, 99, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
		transition: 'all .2s ease',
		textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
	},
	error: {
		color: '#dc2626',
		background: 'linear-gradient(145deg, #fee2e2, #fecaca)',
		border: '1px solid #fca5a5',
		padding: '12px 16px',
		borderRadius: 10,
		fontSize: 14,
		fontWeight: 500,
		boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)'
	},
	footer: {
		marginTop: 28,
		textAlign: 'center'
	}
}
