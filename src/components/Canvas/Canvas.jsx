import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
import styles from './Canvas.module.scss';
import { FaTrashAlt, FaPen } from 'react-icons/fa';

const Canvas = ({ droppedItems, setDroppedItems }) => {
  const offset = droppedItems.length * 40;
  const [selectedId, setSelectedId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'component',
    drop: (item) => {
      setDroppedItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: item.type,
          x: 10,
          y: offset,
          width: 200,
          height: 100,
          content: item.type === 'header' ? 'Header' :
            item.type === 'paragraph' ? 'Paragraph' :
              item.type === 'image' ? '' : '',
        },
      ]);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });


  useEffect(() => {
    const saved = localStorage.getItem('savedLayout');
    if (saved) {
      const parsed = JSON.parse(saved);
      const updatedLayout = parsed.map((item) => ({
        ...item,
        x: item.x ?? 10,
        y: item.y ?? 10,
        width: item.width ?? 200,
        height: item.height ?? 100,
        content: item.content ?? '',
      }));
      setDroppedItems(updatedLayout);
    }
  }, [setDroppedItems]);

  return (
    <>
      <div ref={dropRef} className={`${styles.canvas} ${isOver ? styles.active : ''}`}>
        {droppedItems.length === 0 ? (
          <p className={styles.placeholder}>Drag components here</p>
        ) : (
          droppedItems.map((item) => {
            const isSelected = item.id === selectedId;

            return (
              <Rnd
                key={item.id}
                default={{
                  x: item.x ?? 10,
                  y: item.y ?? 10,
                  width: item.width ?? 200,
                  height: item.height ?? 100,
                }}
                bounds="parent"
                className={`${styles.rndBox} ${isSelected ? styles.selectedBox : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(item.id);
                }}
                onDragStop={(e, d) => {
                  const updated = droppedItems.map(i =>
                    i.id === item.id ? { ...i, x: d.x, y: d.y } : i
                  );
                  setDroppedItems(updated);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const updated = droppedItems.map(i =>
                    i.id === item.id
                      ? {
                        ...i,
                        width: parseInt(ref.style.width, 10),
                        height: parseInt(ref.style.height, 10),
                        x: position.x,
                        y: position.y,
                      }
                      : i
                  );
                  setDroppedItems(updated);
                }}
              >

                <div style={{ position: 'relative', height: '100%' }}>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: -40,
                      right: 0,
                      background: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      display: 'flex',
                      gap: '10px',
                      zIndex: 10,
                      alignItems: 'center'
                    }}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setEditingText(item.content || '');
                          setEditingId(item.id);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <FaPen /> Edit
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          const updated = droppedItems.filter(i => i.id !== item.id);
                          setDroppedItems(updated);
                          setSelectedId(null);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  )}


                  {editingId === item.id ? (
                    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', padding: '10px' }}>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        style={{ width: '100%', height: '60%', resize: 'none', boxSizing: 'border-box' }}
                      />
                      <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const updated = droppedItems.map(i =>
                              i.id === item.id ? { ...i, content: editingText } : i
                            );
                            setDroppedItems(updated);
                            setEditingId(null);
                            setEditingText('');
                          }}
                        >✅ Save</button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingText('');
                          }}
                        >❌ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.componentBox}>
                      {(() => {
                        if (!item || !item.type) return null;
                        switch (item.type) {
                          case 'header':
                            return <h2>{item.content || 'Header'}</h2>;
                          case 'paragraph':
                            return <p>{item.content || 'Paragraph'}</p>;
                          case 'image':
                            return (
                              <img
                                src={item.content || "https://placehold.co/150"}
                                alt="placeholder"
                                className={styles.componentBox}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            );
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  )}
                </div>
              </Rnd>
            );
          })
        )}
      </div>
    </>
  );
};

export default Canvas;
