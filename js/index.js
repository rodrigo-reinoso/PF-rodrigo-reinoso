
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

function guardarProductoEnLocalStorage(producto, cantidad) {

  const agregarProducto = {
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: parseInt(cantidad),
    imagen: `.${producto.imagen}`
  };

  // Si no hay productos cargados a Local Storage
  if (carrito === null) {
    carrito = [agregarProducto];

  } else {
    // Buscar indice de producto en local storage
    const buscarIndiceDeProducto = carrito.findIndex((el) => {
      return el.nombre === agregarProducto.nombre;
    });

    if (buscarIndiceDeProducto === -1) {
      carrito.push(agregarProducto);
    } else {
      carrito[buscarIndiceDeProducto].cantidad += parseInt(cantidad);
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
      if (cantidad >= 1) {
        guardarProductoEnLocalStorage(producto, cantidad);
      } else {
        alert("Debe ingresar un número mayor a 0.")
      }
    });

    // Agregar elementos al DOM
    contenedorBoton.append(boton, inputBoton);
    divContenido.append(titulo, contenedorBoton, precio);
    divCard.append(imagen, divContenido);

    // Agregar la tarjeta al contenedor principal
    contenedorProductos.append(divCard);
  }
}
const productos = [
  new Producto(0, "Camiseta Oficial 2023", 23000, 12, "../recursos/tienda/camiseta-oficial-calidad.webp"),
  new Producto(1, "Camiseta Alternativa 2023", 21000, 8, "../recursos/tienda/camiseta-alternativa-negra-calidad.webp"),
  new Producto(2, "Camiseta Arquero 2023", 19000, 5, "../recursos/../recursos/tienda/camiseta-arquero-calidad.webp"),
  new Producto(3, "Musculosa de entrenamiento 2023", 15000, 10, "../recursos/tienda/entrenamiento-calidad.webp"),
  new Producto(4, "Buzo de concentración 2023", 20000, 7, "../recursos/tienda/buzo-calidad.webp"),
  new Producto(5, "Buzo de entrenamiento 2023", 18000, 6, "../recursos/tienda/buxzo-negro.jpg"),
];


let carrito = [];
console.log(carrito)

renderizarProductos(productos);