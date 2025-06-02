document.addEventListener('DOMContentLoaded', async () => {
    const ticketsListDiv = document.getElementById('tickets-list');
    const loadingMessage = document.getElementById('loading-message');
    const noTicketsMessage = document.getElementById('no-tickets-message');
    const errorMessage = document.getElementById('error-message');

    const adminToken = localStorage.getItem('adminToken');

    // --- CHECK FOR AUTHENTICATION ---
    if (!adminToken) {
        alert('You must be logged in as an administrator to access this page.');
        window.location.href = 'login.html'; // Redirect to login page
        return; // Stop further execution
    }

    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noTicketsMessage.style.display = 'none';

        // Fetch tickets from your backend API
        const response = await fetch('http://localhost:5000/api/tickets', {
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': adminToken // Include the admin token in the header
            }
        });
        
        if (!response.ok) {
            // Handle specific unauthorized error
            if (response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('adminToken'); // Clear invalid token
                window.location.href = 'login.html';
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
                ticketCard.className = 'col-md-6 col-lg-4';
                ticketCard.innerHTML = `
                    <div class="ticket-card">
                        <h5>Ticket ID: ${ticket._id}</h5>
                        <p><strong>Name:</strong> ${ticket.name}</p>
                        <p><strong>Email:</strong> ${ticket.email}</p>
                        <p><strong>Employee ID:</strong> ${ticket.employeeId || 'N/A'}</p>
                        <p><strong>Category:</strong> ${ticket.category}</p>
                        <p><strong>Subject:</strong> ${ticket.subject}</p>
                        <p><strong>Description:</strong> ${ticket.description}</p>
                        <p><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span></p>
                        <p><strong>Submitted:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
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
            case 'In Progress': return 'bg-warning text-dark';
            case 'Resolved': return 'bg-success';
            case 'Closed': return 'bg-secondary';
            default: return 'bg-info';
        }
    }
});