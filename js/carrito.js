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

function calcularTotal(productos){
    const totalCompra = productos.reduce((acc,producto) =>{
        return acc + producto.total;
    }, 0);
    return totalCompra;
}

function mostrarTotal(productos){
    const contenedorTotalCarrito = document.getElementById("contenedorTotalCarrito");
    const totalCompra =  calcularTotal(productos);
    const total = document.getElementById("total");
    total.innerText = `TOTAL: $${totalCompra}`;

    if(carrito.length <= 0){
        total.classList.add("d-none");
        contenedorTotalCarrito.classList.add("d-none");

    } else {
        total.classList.remove("d-none");
        contenedorTotalCarrito.classList.remove("d-none");
    }
}

function finalizarCompra() {
    const botonFinalizarCompra = document.getElementById("finalizarCompra");
    
    if (carrito.length <= 0) {
        botonFinalizarCompra.classList.add("d-none");
    } else {
        botonFinalizarCompra.classList.remove("d-none");
    }

    botonFinalizarCompra.innerHTML = ""; 

    const botonEvento = document.createElement("h4");
    botonEvento.innerText = "Finalizar Compra";
    botonEvento.className = "btn btn-danger";

    botonFinalizarCompra.appendChild(botonEvento);

    botonEvento.addEventListener("click", () => {
        localStorage.setItem("carrito", JSON.stringify([]));
        const totalCompra = calcularTotal(carrito);
        carrito = []; 
        obtenerProductosDeLocalStorage();
        Swal.fire({
            title: "¡Finalizando su compra!",
            text: `Su total a abonar es: $${totalCompra}. Lo esperamos en nuestro local para retirar su pedido.`,
            icon: "success"
        });
       
        renderizarCarrito(carrito);
        finalizarCompra(); 
    });
}


let carrito = [];

obtenerProductosDeLocalStorage();
renderizarCarrito(carrito);
finalizarCompra();
