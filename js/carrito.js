function obtenerProductosDeLocalStorage() {
    const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"));
    carrito = carritoEnLocalStorage ? carritoEnLocalStorage : [];
}

function eliminarProductos(producto) {
    const indeceParaEliminarProducto = carrito.findIndex((el) => {
        return producto.nombre === el.nombre;
    });

    if (indeceParaEliminarProducto !== -1) {
        carrito.splice(indeceParaEliminarProducto, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito(carrito);
    }
}

function renderizarCarrito(carrito) {

    const contenedor = document.getElementById("carritoDeCompras");
    contenedor.innerHTML = "";

    obtenerProductosDeLocalStorage();

    for (const productosCarrito of carrito) {
        const divPadre = document.createElement("div");
        divPadre.classList.add("carrito");

        const imagenProducto = document.createElement("img");
        imagenProducto.classList.add("carrito__imagen");
        imagenProducto.setAttribute("src", productosCarrito.imagen);

        const cantidadProducto = document.createElement("p");
        cantidadProducto.classList.add("carrito__texto")
        cantidadProducto.innerText = productosCarrito.cantidad;

        const totalProducto = document.createElement("p");
        totalProducto.classList.add("carrito__texto")
        totalProducto.innerText = `$ ${productosCarrito.total}`;

        const eliminarProducto = document.createElement("button");
        eliminarProducto.classList.add("carrito__boton")
        eliminarProducto.innerText = "x";

        eliminarProducto.addEventListener("click", () => {
            eliminarProductos(productosCarrito);
        });

        divPadre.append(imagenProducto, cantidadProducto, totalProducto, eliminarProducto);
        contenedor.append(divPadre);
    }
}

let carrito = [];

obtenerProductosDeLocalStorage();
renderizarCarrito(carrito);