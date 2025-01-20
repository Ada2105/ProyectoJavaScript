// ======================= RESERVATION =======================

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    const loginModal = document.getElementById("login-modal");
    const cancelLogin = document.getElementById("cancel-login");
    const loginForm = document.getElementById("login-form");

    document.getElementById("reservation-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener valores del formulario
        const guests = document.getElementById("guests").value;
        const checkIn = document.getElementById("check-in").value;
        const checkOut = document.getElementById("check-out").value;

        if (!guests || !checkIn || !checkOut) {
            alert("Please fill out all fields.");
            return;
        }

        // Calcular días
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/rooms");
            const rooms = await response.json();

            // Filtrar habitaciones disponibles
            const filteredRooms = rooms.filter((room) => {
                const roomGuests = parseInt(room.guests.split(" ")[0]);
                const isAvailable = room.reservations.every((reservation) => {
                    const resCheckIn = new Date(reservation.checkIn);
                    const resCheckOut = new Date(reservation.checkOut);

                    return !(checkOutDate <= resCheckIn || checkInDate >= resCheckOut);
                });

                return roomGuests >= guests && isAvailable;
            });

            // Mostrar habitaciones disponibles
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = "";

            if (filteredRooms.length === 0) {
                resultsContainer.innerHTML = "<p class='text-center text-gray-600'>No rooms available for the selected criteria.</p>";
                return;
            }

            filteredRooms.forEach((room) => {
                const totalCost = room.price * days;
                const roomCard = `
                    <div class="bg-white rounded shadow-md">
                        <div class="card-header relative w-full h-48 overflow-hidden">
                            <img src="https://img.freepik.com/free-photo/interior-modern-comfortable-hotel-room_1232-1823.jpg" 
                                alt="Room Image" class="w-full h-full object-cover">
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-bold mb-2">${room.description}</h3>
                            <p class="text-sm mb-1"><strong>Guests:</strong> ${room.guests}</p>
                            <p class="text-sm mb-1"><strong>Price per night:</strong> $${room.price}</p>
                            <p class="text-sm mb-1"><strong>Total for ${days} ${days > 1 ? "nights" : "night"}:</strong> $${totalCost}</p>
                            <p class="text-sm mb-1"><strong>Features:</strong> ${room.Terrace ? "Terrace" : ""}, ${room["Internet access"] ? "Internet" : ""}</p>
                            <p class="text-sm"><strong>Minibar:</strong> ${room.Minibar ? "Yes" : "No"}</p>
                            <button class="reserve-btn bg-blue-500 text-white px-4 py-2 mt-2 rounded" data-room-id="${room.id}">
                                Reserve
                            </button>
                        </div>
                    </div>
                `;
                resultsContainer.innerHTML += roomCard;
            });

            // Agregar evento de clic a los botones de reserva
            document.querySelectorAll(".reserve-btn").forEach((button) => {
                button.addEventListener("click", (e) => {
                    loginModal.classList.remove("hidden"); // Mostrar modal
                });
            });

            // Cancelar el inicio de sesión
            cancelLogin.addEventListener("click", () => {
                loginModal.classList.add("hidden"); // Ocultar modal
            });

            // Manejar el formulario de inicio de sesión
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;

                if (!email || !password) {
                    alert("Please enter both email and password.");
                    return;
                }

                // Simular inicio de sesión exitoso
                alert("Login successful! Proceeding with reservation...");
                loginModal.classList.add("hidden"); // Ocultar modal
            });
        } catch (error) {
            console.error("Error fetching rooms:", error);
            alert("An error occurred while checking availability. Please try again later.");
        }
    });
});








// ======================= Menu hamburuesa =======================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});



// ======================= Slider Principal =======================
const slider = document.getElementById('slider');
let currentIndexSlider = 0;
const slides = Array.from(slider.children);
const totalSlides = slides.length;

// Cambia al siguiente slide automáticamente cada 5 segundos
const intervalSlider = setInterval(() => {
    currentIndexSlider = (currentIndexSlider + 1) % totalSlides;
    updateSlider();
}, 5000);

// Listener para el botón "next"
document.getElementById('next-slider').addEventListener('click', () => {
    clearInterval(intervalSlider); // Detén el temporizador cuando el usuario interactúa
    currentIndexSlider = (currentIndexSlider + 1) % totalSlides;
    updateSlider();
});

// Listener para el botón "prev"
document.getElementById('prev-slider').addEventListener('click', () => {
    clearInterval(intervalSlider); // Detén el temporizador cuando el usuario interactúa
    currentIndexSlider = (currentIndexSlider - 1 + totalSlides) % totalSlides;
    updateSlider();
});

// Actualiza la posición del slider
function updateSlider() {
    slider.style.transform = `translateX(-${currentIndexSlider * 100}%)`;
    slider.style.transition = 'transform 0.5s ease-in-out';
}