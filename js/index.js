// CLASES
class Producto {
  constructor(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
  }
}

// FUNCIONES

function obtenerProdDeJSON() {
  return new Promise((resolve, reject) => {
     fetch('../productos.json').then((response) => {
        return response.json();
     }).then((responseJson) => {
        for (const producto of responseJson) {
           productos.push(new Producto(...producto));
        }
        resolve();
     });
  });
}

function guardarProductoEnLocalStorage(producto, cantidad) {
  cantidad = parseInt(cantidad);

  const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito")) || [];

  const productoExistente = carritoEnLocalStorage.find(item => item.nombre === producto.nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
    productoExistente.total = productoExistente.cantidad * producto.precio;
    if (productoExistente.cantidad > producto.stock) {
      Swal.fire({
        title: 'Error!',
        text: `Ingrese una cantidad menor. Stock disponible: ${producto.stock} ${producto.nombre}.`,
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
  } else {
    const agregarProducto = {
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: `${producto.imagen}`,
      total: producto.precio * cantidad
    };

    if (agregarProducto.cantidad > producto.stock) {
      Swal.fire({
        title: 'Error!',
        text: `Ingrese una cantidad menor. Stock disponible: ${producto.stock} ${producto.nombre}.`,
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    carritoEnLocalStorage.push(agregarProducto);
  }

  // Actualizar el stock del producto en el array de productos
  const indexProducto = productos.findIndex(item => item.nombre === producto.nombre);
  productos[indexProducto].stock -= cantidad; // Restar la cantidad del carrito al stock

  // Actualizar el stock en el localStorage
  const productosEnLocalStorage = JSON.parse(localStorage.getItem("productos")) || [];
  productosEnLocalStorage[indexProducto].stock -= cantidad;
  localStorage.setItem("productos", JSON.stringify(productosEnLocalStorage));

  localStorage.setItem("carrito", JSON.stringify(carritoEnLocalStorage)); // Actualizar el carrito en el localStorage

  if (!productoExistente) {
    Swal.fire({
      title: '¡Agregado al Carrito!',
      icon: 'success',
      timer: 1500
    });
  }
}

function obtenerProductosDeLocalStorage() {
  const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"));
  carrito = carritoEnLocalStorage ? carritoEnLocalStorage : [];
}

function renderizarProductos(productos) {
  const contenedorProductos = document.querySelector('.contenedor-productos-tienda');
  contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de renderizar los productos

  obtenerProductosDeLocalStorage();

  for (const producto of productos) {
    // Crear el elemento div.card
    const divCard = document.createElement('div');
    divCard.className = 'card producto-tienda';
    divCard.style.width = '21rem';

    // Crear el elemento img
    const imagen = document.createElement('img');
    imagen.src = producto.imagen;
    imagen.alt = `Imagen ${producto.nombre}`;
    imagen.className = 'card-img-top';

    // Crear el elemento div.contenido
    const divContenido = document.createElement('div');
    divContenido.className = 'contenido';

    // Crear los elementos h2, p (precio) y button dentro de div.contenido
    const titulo = document.createElement('h2');
    titulo.className = 'card-text informacion-card';
    titulo.innerText = producto.nombre;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.innerText = `$${producto.precio}`;

    const contenedorBoton = document.createElement("div");
    contenedorBoton.classList = "contenedor-boton";

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-producto';
    boton.innerText = 'Agregar al carrito';

    const inputBoton = document.createElement("input");
    inputBoton.type = "number";
    inputBoton.className = "input-producto";
    inputBoton.min = 1;
    inputBoton.value = 1;

    boton.addEventListener('click', () => {
      const cantidad = inputBoton.value;
      if (cantidad <= 0) {
        Swal.fire({
          title: 'Error!',
          text: 'Ingrese una cantidad válida mayor a 0.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      } else if (cantidad > producto.stock) {
        
        Swal.fire({
          title: 'Error!',
          text: `Ingrese una cantidad menor. Stock disponible: ${producto.stock} ${producto.nombre}.`,
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      } else {
        guardarProductoEnLocalStorage(producto, cantidad);
        Swal.fire({
          title: '¡Agregado al Carrito!',
          icon: 'success',
          timer: 1500
        });
      }
      renderizarProductos(productos);
    });
    

    // Agregar elementos al DOM
    contenedorBoton.append(boton, inputBoton);
    divContenido.append(titulo, contenedorBoton, precio);
    divCard.append(imagen, divContenido);

    // Agregar la tarjeta al contenedor principal
    contenedorProductos.append(divCard);
  }
}

// Inicio del programa
let carrito = [];
const productos = [];

obtenerProductosDeLocalStorage();
obtenerProdDeJSON().then(() => {
  renderizarProductos(productos);
});