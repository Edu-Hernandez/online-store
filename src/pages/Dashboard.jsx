import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function Dashboard() {
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', imagenes: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    // Validar tamaño de archivo
    const invalidFiles = files.filter((file) => file.size > 100 * 1024); // 100 KB
    if (invalidFiles.length > 0) {
      setError('Cada imagen debe ser menor a 100 KB');
      return;
    }
    if (files.length > 2) {
      setError('Máximo 2 imágenes por producto');
      return;
    }
    // Convertir a Base64
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then((base64Images) => {
        setForm({ ...form, imagenes: base64Images });
      })
      .catch(() => setError('Error al convertir imágenes'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('Usuario autenticado:', auth.currentUser); // Depuración

    if (!form.nombre || !form.precio || !form.descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (form.imagenes.length === 0) {
      setError('Debes agregar al menos una imagen');
      return;
    }
    if (!auth.currentUser) {
      setError('Debes estar autenticado para subir productos');
      return;
    }
    // Estimar tamaño del documento
    const totalSize = JSON.stringify({
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      descripcion: form.descripcion,
      images: form.imagenes,
      creado: new Date().toISOString()
    }).length;
    if (totalSize > 900000) {
      setError('El producto excede el límite de 900 KB');
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        descripcion: form.descripcion,
        images: form.imagenes, // Strings Base64
        creado: new Date().toISOString()
      });

      setSuccess('Producto guardado exitosamente');
      setForm({ nombre: '', precio: '', descripcion: '', imagenes: [] });
    } catch (error) {
      setError('Error al guardar producto: ' + error.message);
      console.error('Error details:', error);
    }
  };

  return (
    <div className="admin-product-form">
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Precio"
          type="number"
          step="0.01"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          required
        ></textarea>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Subir</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}