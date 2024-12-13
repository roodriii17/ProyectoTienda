const BASE_URL = "https://api.escuelajs.co/api/v1";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeCategory = null;
let currentPage = 1;
let isLoading = false;
let infiniteScrollEnabled = false;
let currentUser = null;

const productList = document.getElementById("productList");
const categoriasCarousel = document.getElementById("categoriasCarousel");
const cargarMasButton = document.getElementById("cargarMasButton");
const loadingSpinner = document.getElementById("loadingSpinner");
const cartCounter = document.getElementById("cartCounter");
const cartModal = document.getElementById("cartModal");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const checkoutButton = document.getElementById("finalizarPedido");
const botonIniciarSesion = document.getElementById("botonIniciarSesion");
const botonRegistrarse = document.getElementById("botonRegistrarse");
const closeLoginModalButton = document.getElementById("closeLoginModal");
const closeRegisterModalButton = document.getElementById("closeRegisterModal");
const imagenPorDefecto = "https://placehold.co/300x300?text=Without+Image";

const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


// Gestión de Usuarios

const users = [];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    loginModal.classList.remove("active");
    alert("Inicio de sesión exitoso");
  } else {
    alert("Credenciales incorrectas");
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    alert("El usuario ya existe");
  } else {
    users.push({ email, password });
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    registerModal.classList.remove("active");
  }
});


// Cargar Categorías y Carrusel

async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const categories = await response.json();
    categoriasCarousel.innerHTML = "";

    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-card");

      const categoryImage = category.image || imagenPorDefecto;
      categoryDiv.innerHTML = `
        <img src="${categoryImage}" alt="${category.name}" class="category-image" />
        <h3>${category.name}</h3>
      `;

      categoryDiv.addEventListener("click", () => {
        activeCategory = category.id;
        currentPage = 1;
        productList.innerHTML = "";
        loadProductsByCategory();
        infiniteScrollEnabled = false;
      });

      categoriasCarousel.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}


// Cargar Productos

async function fetchProducts(page = 1) {
  const url = `${BASE_URL}/products?offset=${(page - 1) * 10}&limit=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
}

async function fetchProductsByCategory(categoryId, page = 1) {
  const url = `${BASE_URL}/categories/${categoryId}/products?offset=${(page - 1) * 10}&limit=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al cargar productos por categoría:", error);
    return [];
  }
}

async function loadProductsByCategory() {
  if (isLoading) return;
  isLoading = true;

  loadingSpinner.style.display = "flex";

  try {
    const products = activeCategory
      ? await fetchProductsByCategory(activeCategory, currentPage)
      : await fetchProducts(currentPage);

    if (products.length > 0) {
      displayProducts(products);
      currentPage++;
    } else if (currentPage === 1) {
      productList.innerHTML = "<p>No se encontraron productos.</p>";
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productList.innerHTML = "<p>Error al cargar productos.</p>";
  } finally {
    loadingSpinner.style.display = "none";
    isLoading = false;
  }
}

function displayProducts(products) {
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const productImage = product.images?.[0] || imagenPorDefecto;
    productDiv.innerHTML = `
      <img src="${productImage}" alt="${product.title}" class="productImage" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Añadir al carrito</button>
    `;
    productList.appendChild(productDiv);

    productDiv.addEventListener("click", () => {
      showProductDetails(product);
    });
  });
}


// Gestión de Scroll Infinito

function enableInfiniteScroll() {
  infiniteScrollEnabled = true;
  window.addEventListener("scroll", handleInfiniteScroll);
}

function disableInfiniteScroll() {
  infiniteScrollEnabled = false;
  window.removeEventListener("scroll", handleInfiniteScroll);
}

function handleInfiniteScroll() {
  if (
    infiniteScrollEnabled &&
    !isLoading &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  ) {
    loadProductsByCategory();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  cargarMasButton.addEventListener("click", () => {
    enableInfiniteScroll();
    loadProductsByCategory();
  });
});


const productDetailsModal = document.getElementById("productDetailsModal");
const productTitle = document.getElementById("productTitle");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const addToCartFromDetails = document.getElementById("addToCartFromDetails");



// Función "Añadir al Carrito" 

async function addToCart(productId, productName, productPrice) {
  if (isLoading) return; // Evitar añadir al carrito mientras se carga
  isLoading = true;

  try {
    // Código para añadir el producto al carrito (por ejemplo, guardándolo en localStorage, etc.)
    console.log(`${productName} añadido al carrito!`);
  } catch (error) {
    console.error("Error al añadir el producto al carrito:", error);
  } finally {
    isLoading = false;
  }
}


// Manejo de Deshabilitar el Botón "Cargar Más"

cargarMasButton.addEventListener("click", () => {
  if (isLoading) return; // Evitar clics durante la carga
  enableInfiniteScroll();
  loadProductsByCategory();
  cargarMasButton.disabled = true; 
});

// Habilitar/Deshabilitar el botón "Cargar Más" según la disponibilidad de productos
function handleLoadMoreButtonState(products) {
  if (products.length === 0) {
    cargarMasButton.disabled = true; 
  } else {
    cargarMasButton.disabled = false;
  }
}



// Función para actualizar el carrito

function updateCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("cart-item");
    productDiv.innerHTML = `
      <h3>${product.title}</h3>
      <p>Precio: $${product.price}</p>
      <div>
        <button onclick="decreaseQuantity(${product.id})">-</button>
        <span>${product.quantity}</span>
        <button onclick="increaseQuantity(${product.id})">+</button>
      </div>
      <button onclick="removeFromCart(${product.id})">Eliminar</button>
    `;
    cartItemsList.appendChild(productDiv);
    total += product.price * product.quantity;
  });

  cartTotal.innerText = total.toFixed(2);
}


// Funciones para modificar la cantidad de productos

function increaseQuantity(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += 1;
    saveCartToLocalStorage();
    updateCart();
    updateCartCounter();
  }
}

function decreaseQuantity(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    saveCartToLocalStorage();
    updateCart();
    updateCartCounter();
  } else {
    removeFromCart(productId);
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocalStorage();
  updateCart();
  updateCartCounter();
}


// Función para actualizar el contador del carrito

function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.innerText = totalItems;
}


// Guardar el carrito en localStorage

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// Función para mostrar los detalles del producto

function showProductDetails(product) {
  productTitle.textContent = product.title;
  productImage.src = product.images?.[0] || "https://placehold.co/300x300?text=No+Image";
  productDescription.textContent = product.description || "Descripción no disponible.";
  productPrice.textContent = product.price.toFixed(2);

  addToCartFromDetails.onclick = () => {
    addToCart(product.id, product.title, product.price);
    alert("Producto añadido al carrito.");
  };

  productDetailsModal.classList.add("active");

  document.getElementById("closeProductDetailsModal").addEventListener("click", () => {
    productDetailsModal.classList.remove("active");
  });
}


// Finalizar pedido

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  alert("Pedido finalizado. Gracias por tu compra.");
  cart = [];
  saveCartToLocalStorage();
  updateCart();
  updateCartCounter();
});




// Mostrar y Cerrar Modales

botonIniciarSesion.addEventListener("click", () => {
  loginModal.classList.add("active");
});

botonRegistrarse.addEventListener("click", () => {
  registerModal.classList.add("active");
});

closeLoginModalButton.addEventListener("click", () => {
  loginModal.classList.remove("active");
});

closeRegisterModalButton.addEventListener("click", () => {
  registerModal.classList.remove("active");
});


// Gestión de Registro

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  // Verificar si el usuario ya existe
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    alert("El usuario ya está registrado.");
    return;
  }

  // Registrar nuevo usuario
  users.push({ email, password });
  alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
  registerModal.classList.remove("active");
});


// Gestión de Inicio de Sesión

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Buscar usuario por email y contraseña
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    alert(`Bienvenido, ${currentUser.email}`);
    loginModal.classList.remove("active");
  } else {
    alert("Correo o contraseña incorrectos.");
  }
});


// Validación de Acciones del Usuario

function ensureLoggedIn() {
  if (!currentUser) {
    alert("Debes iniciar sesión para realizar esta acción.");
    return false;
  }
  return true;
}


// Inicializar Aplicación

async function initialize() {
  await fetchCategories();
  loadProductsByCategory();
  updateCartCounter();
}

initialize();
