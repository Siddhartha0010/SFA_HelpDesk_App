// Function to show a custom modal message
function showCustomModal(message, callback) {
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkButton = document.getElementById('modal-ok-button');

    modalMessage.textContent = message;
    modal.classList.remove('hidden');

    modalOkButton.onclick = () => {
        modal.classList.add('hidden');
        if (callback) {
            callback();
        }
    };
}

// Function to handle redirection
function redirectToLogin() {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const ticketsListDiv = document.getElementById('tickets-list');
    const loadingMessage = document.getElementById('loading-message');
    const noTicketsMessage = document.getElementById('no-tickets-message');
    const errorMessage = document.getElementById('error-message');
    const logoutButton = document.getElementById('logout-button');

    const adminToken = localStorage.getItem('adminToken');

    // --- CHECK FOR AUTHENTICATION ---
    if (!adminToken) {
        showCustomModal('You must be logged in as an administrator to access this page.', redirectToLogin);
        return; // Stop further execution
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken'); // Clear the token
        showCustomModal('You have been logged out.', redirectToLogin);
    });

    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noTicketsMessage.style.display = 'none';

        // Fetch tickets from your backend API
        // Ensure the API endpoint is correct for fetching all tickets
        const response = await fetch('https://sfa-helpdesk-app.onrender.com/tickets', { // Assuming '/tickets' is the endpoint
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': adminToken // Include the admin token in the header
            }
        });
        
        if (!response.ok) {
            // Handle specific unauthorized error
            if (response.status === 401) {
                showCustomModal('Session expired or unauthorized. Please log in again.', () => {
                    localStorage.removeItem('adminToken'); // Clear invalid token
                    redirectToLogin();
                });
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tickets = await response.json();

        loadingMessage.style.display = 'none';

        if (tickets.length === 0) {
            noTicketsMessage.style.display = 'block';
        } else {
            tickets.forEach(ticket => {
                const ticketCard = document.createElement('div');
                ticketCard.className = 'w-full'; // Tailwind for full width in grid column
                ticketCard.innerHTML = `
                    <div class="ticket-card">
                        <h5 class="text-xl font-semibold text-gray-900 mb-2">Ticket ID: ${ticket._id}</h5>
                        <p class="text-gray-700 mb-1"><strong>Name:</strong> ${ticket.name}</p>
                        <p class="text-gray-700 mb-1"><strong>Email:</strong> ${ticket.email}</p>
                        <p class="text-gray-700 mb-1"><strong>Employee ID:</strong> ${ticket.employeeId || 'N/A'}</p>
                        <p class="text-gray-700 mb-1"><strong>Category:</strong> ${ticket.category}</p>
                        <p class="text-gray-700 mb-1"><strong>Subject:</strong> ${ticket.subject}</p>
                        <p class="text-gray-700 mb-1"><strong>Description:</strong> ${ticket.description}</p>
                        <p class="text-gray-700 mb-2"><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span></p>
                        <p class="text-sm text-gray-500"><strong>Submitted:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                `;
                ticketsListDiv.appendChild(ticketCard);
            });
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Failed to load tickets: ${error.message}. Please ensure the backend is running and you are logged in.`;
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Open': return 'bg-danger';
            case 'In Progress': return 'bg-warning text-black'; // text-black for better contrast on warning
            case 'Resolved': return 'bg-success';
            case 'Closed': return 'bg-secondary';
            default: return 'bg-info';
        }
    }
});
