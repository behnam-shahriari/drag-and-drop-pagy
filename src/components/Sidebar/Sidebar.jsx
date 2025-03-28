import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './Sidebar.module.scss';
import { FaDownload, FaFileExport, FaSave, FaTrashAlt } from 'react-icons/fa';

const SidebarItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={styles.item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
};

const Sidebar = ({ onSave, onLoad, onClear, onExport }) => {
  return (
    <div className={styles.sidebar}>
      <div>
        <h3>Components</h3>
        <div className={styles.componentList}>
          <SidebarItem type="header" label="Header" />
          <SidebarItem type="paragraph" label="Paragraph" />
          <SidebarItem type="image" label="Image" />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.button} onClick={onSave}>
          <FaSave /> Save Layout
        </button>
        <button className={styles.button} onClick={onLoad}>
          <FaDownload /> Load Layout
        </button>

        <button className={styles.button} onClick={onExport}>
          <FaFileExport /> Export Layout
        </button>

        <button className={styles.clearButton} onClick={onClear}>
          <FaTrashAlt /> Clear Canvas
        </button>

      </div>
    </div>
  );
};

export default Sidebar;
