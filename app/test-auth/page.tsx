'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [email] = useState('test@example.com');
  const [password] = useState('password123');
  const [name] = useState('Test User');

  async function testRegister() {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      setResult({ type: 'register', status: res.status, data });
    } catch (error) {
      setResult({ type: 'register', error: String(error) });
    }
  }

  async function testLogin() {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setResult({ type: 'login', status: res.status, data });
    } catch (error) {
      setResult({ type: 'login', error: String(error) });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Test Autenticación</h1>

        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <p className="text-sm">
            <strong>Email:</strong> {email}
          </p>
          <p className="text-sm">
            <strong>Password:</strong> {password}
          </p>
          <p className="text-sm">
            <strong>Name:</strong> {name}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={testRegister}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            Test Register
          </button>

          <button
            onClick={testLogin}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700"
          >
            Test Login
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">
              Resultado: {result.type}
            </h2>
            <pre className="overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
