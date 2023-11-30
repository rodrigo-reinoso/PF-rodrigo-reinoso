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

  const agregarProducto = {
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: parseInt(cantidad),
    total: producto.precio * cantidad,
    stock: producto.stock,
    imagen: `${producto.imagen}`
  };

  // Si no hay productos cargados a Local Storage
  if (carrito === null) {
    carrito = [agregarProducto];

  } else {
    if (agregarProducto.stock >= agregarProducto.cantidad) {
      agregarProducto.stock -= agregarProducto.cantidad;
    }

    const buscarIndiceDeProducto = carrito.findIndex((el) => {
      return el.nombre === agregarProducto.nombre;
    });

    if (buscarIndiceDeProducto === -1) {
      carrito.push(agregarProducto);
    } else {
      carrito[buscarIndiceDeProducto].cantidad += parseInt(cantidad);
      carrito[buscarIndiceDeProducto].total += parseInt(agregarProducto.total);
      carrito[buscarIndiceDeProducto].stock -= parseInt(cantidad);
    }
  }
  // Actualizar Local Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
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

    const cajaPrecioStock = document.createElement("div");
    cajaPrecioStock.classList.add("d-flex", "align-items-center", "flex-column", "mt-4");

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.innerText = `$${producto.precio}`;

    const productoEnCarrito = carrito.find((item) => item.nombre === producto.nombre);
    const stockAMostrar = productoEnCarrito ? productoEnCarrito.stock : producto.stock;

    const stock = document.createElement("p");
    stock.innerHTML = `<strong>Stock: </strong> ${stockAMostrar}`;

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
      } else if (cantidad > stockAMostrar) {

        Swal.fire({
          title: 'Error!',
          text: `Ingrese una cantidad menor. Stock disponible: ${stockAMostrar} ${producto.nombre}.`,
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
    cajaPrecioStock.append(precio, stock)
    contenedorBoton.append(boton, inputBoton);
    divContenido.append(titulo, contenedorBoton, cajaPrecioStock);
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