import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import styles from './App.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [droppedItems, setDroppedItems] = useState([]);


  const handleSave = () => {
    localStorage.setItem('savedLayout', JSON.stringify(droppedItems));
    toast.success('Layout saved!');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('savedLayout');
    if (!saved) {
      toast.info('No layout found');
      return;
    }
  
    try {
      const parsed = JSON.parse(saved);
  
      const updatedLayout = parsed.map(item => ({
        id: item.id ?? Date.now(),
        type: item.type ?? 'paragraph',
        x: item.x ?? 10,
        y: item.y ?? 10,
        width: item.width ?? 200,
        height: item.height ?? 100,
        content: item.content ?? '',
      }));
  
      // Force a clean slate before applying layout
      setDroppedItems([]); // Clear existing
      setTimeout(() => {
        setDroppedItems(updatedLayout); // Then apply new layout
        toast.success('Layout loaded!');
      }, 0);
  
    } catch (error) {
      console.error('Load Error:', error);
      toast.error('Failed to load layout');
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setDroppedItems([]);
      toast.success("Canvas cleared!");
    }
  };
  
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(droppedItems, null, 2)], {
      type: 'application/json',
    });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'layout.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    toast.success('Layout exported!');
  };
  
  

  return (
    <div className={styles.app}>
      <Sidebar onSave={handleSave} onLoad={handleLoad} onClear={handleClear} onExport={handleExport} />
      <Canvas droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
