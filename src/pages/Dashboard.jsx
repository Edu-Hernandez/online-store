import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function Dashboard() {
  const [form, setForm] = useState({ nombre: '', precio: '', descripcion: '', imagenes: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resizeImage = (file, maxSize = 1000) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% calidad
        resolve(dataUrl);
      };

      reader.readAsDataURL(file);
    });
  };

  const splitBase64InChunks = (base64, chunkSize = 300000) => {
    const chunks = [];
    for (let i = 0; i < base64.length; i += chunkSize) {
      chunks.push(base64.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const handleImageChange = async (e) => {
    const files = [...e.target.files];
    if (files.length > 2) {
      setError('Máximo 2 imágenes por producto');
      return;
    }

    try {
      const resizedImages = await Promise.all(
        files.map((file) => resizeImage(file, 1000)) // Resize a máx 1000px
      );

      // Dividir cada imagen en chunks y almacenarla
      const chunkedImages = resizedImages.map((base64) => splitBase64InChunks(base64));
      setForm({ ...form, imagenes: chunkedImages });
      setError('');
    } catch {
      setError('Error al procesar imágenes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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

    const totalSize = JSON.stringify({
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      descripcion: form.descripcion,
      images: form.imagenes,
      creado: new Date().toISOString()
    }).length;

    if (totalSize > 950000) {
      setError('El producto excede el límite de 950 KB en Firestore');
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        descripcion: form.descripcion,
        // convertir cada imagen (que es un array de chunks) a una cadena completa
        images: form.imagenes.map((imgChunks) => imgChunks.join('')),
        creado: new Date().toISOString()
      });      

      setSuccess('Producto guardado exitosamente');
      setForm({ nombre: '', precio: '', descripcion: '', imagenes: [] });
    } catch (error) {
      setError('Error al guardar producto: ' + error.message);
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
