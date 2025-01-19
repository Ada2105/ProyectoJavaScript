// ======================= RESERVATION =======================


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    document.getElementById("reservation-form").addEventListener("submit", async (e) => {
        console.log("Form submitted");
        e.preventDefault();
        console.log("Form submitted 2");

        // Obtener valores del formulario
        const guests = document.getElementById("guests").value;
        const checkIn = document.getElementById("check-in").value;
        const checkOut = document.getElementById("check-out").value;

        console.log("Guests:", guests);
        console.log("Check-In Date:", checkIn);
        console.log("Check-Out Date:", checkOut);

        if (!guests || !checkIn || !checkOut) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            console.log("Fetching rooms from server...");
            const response = await fetch("http://localhost:3000/rooms");
            const rooms = await response.json();
            console.log("Rooms fetched:", rooms);

            // Filtrar habitaciones disponibles
            const filteredRooms = rooms.filter((room) => {
                const roomGuests = parseInt(room.guests.split(" ")[0]); // Convertir "2 guests" a 2
                console.log(`Checking room: ${room.description}, Guests allowed: ${roomGuests}`);

                const isAvailable = room.reservations.every((reservation) => {
                    const resCheckIn = new Date(reservation.checkIn);
                    const resCheckOut = new Date(reservation.checkOut);
                    const userCheckIn = new Date(checkIn);
                    const userCheckOut = new Date(checkOut);

                    // Verificar si las fechas no se solapan
                    const isOverlap = !(userCheckOut <= resCheckIn || userCheckIn >= resCheckOut);
                    console.log(`Room: ${room.description}, Overlap: ${isOverlap ? "Yes" : "No"}`);
                    return !isOverlap;
                });

                return roomGuests >= guests && isAvailable;
            });

            console.log("Filtered Rooms:", filteredRooms);

            // Mostrar habitaciones disponibles
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = ""; // Limpiar resultados anteriores

            if (filteredRooms.length === 0) {
                console.log("No rooms available for the selected criteria.");
                resultsContainer.innerHTML = "<p class='text-center text-gray-600'>No rooms available for the selected criteria.</p>";
                return;
            }

            filteredRooms.forEach((room) => {
                console.log("Adding room to results:", room.description);
                const roomCard = `
                    <div class="bg-white rounded shadow-md">
                        <!-- Imagen en el header -->
                        <div class="card-header relative w-full h-48 overflow-hidden">
                            <img src="https://img.freepik.com/free-photo/interior-modern-comfortable-hotel-room_1232-1823.jpg?t=st=1737066101~exp=1737069701~hmac=f773d631638ae188c592ee5fb63516874342389422d34649effa0c32d88195a2&w=1380" 
                                alt="Room Image" class="w-full h-full object-cover">
                        </div>
                        <!-- Información de la card con padding -->
                        <div class="p-4">
                            <h3 class="text-lg font-bold mb-2">${room.description}</h3>
                            <p class="text-sm mb-1"><strong>Guests:</strong> ${room.guests}</p>
                            <p class="text-sm mb-1"><strong>Price:</strong> $${room.price} per night</p>
                            <p class="text-sm mb-1"><strong>Features:</strong> ${room.Terrace ? "Terrace" : ""}, ${room["Internet access"] ? "Internet" : ""}</p>
                            <p class="text-sm"><strong>Minibar:</strong> ${room.Minibar ? "Yes" : "No"}</p>
                        </div>
                    </div>
            `;
                resultsContainer.innerHTML += roomCard;
            });
        } catch (error) {
            console.error("Error fetching rooms:", error);
            alert("An error occurred while checking availability. Please try again later.");
        }
    });
});


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

// ======================= Carousel Multi-Item =======================

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const carousel = document.querySelector(".carousel-container");
const track = document.querySelector(".track");
let carouselWidth = carousel.offsetWidth;
let index = 0;

window.addEventListener("resize", function () {
    carouselWidth = carousel.offsetWidth;
});

next.addEventListener("click", function (e) {
    e.preventDefault();
    index = index + 1;
    prev.classList.add("show");
    track.style.transform = "translateX(" + index * -carouselWidth + "px)";
    if (track.offsetWidth - index * carouselWidth < index * carouselWidth) {
        next.classList.add("hide");
    }
});

prev.addEventListener("click", function () {
    index = index - 1;
    next.classList.remove("hide");
    if (index === 0) {
        prev.classList.remove("show");
    }
    track.style.transform = "translateX(" + index * -carouselWidth + "px)";
});

