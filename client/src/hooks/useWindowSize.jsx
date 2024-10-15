import { useState, useEffect } from 'react';

function useWindowSize() {
  // Estado para almacenar el tamaño de la ventana
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Función que actualiza el tamaño de la ventana
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Agregar el evento "resize" cuando el componente se monta
    window.addEventListener('resize', handleResize);

    // Ejecutar la función de inmediato para obtener el tamaño inicial
    handleResize();

    // Limpiar el evento cuando el componente se desmonta
    return () => window.removeEventListener('resize', handleResize);
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez (al montar)

  return windowSize;
}

export default useWindowSize;