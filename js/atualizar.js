document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Obter o token do localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Fazer uma requisição para a API protegida para obter os dados do usuário
        fetch('http://localhost:8000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usuario.name) {
                // Exibir o nome do usuário
                welcomeMessage.textContent = `Bem-vindo, ${data.usuario.name}!`;
            } else {
                // Se não encontrar os dados do usuário, redirecionar para a página de login
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.log("Erro ao obter os dados do usuário:", error);
            window.location.href = 'login.html'; // Redireciona se houver erro
        });
    } else {
        // Redireciona para o login se o token não existir
        window.location.href = 'login.html';
    }
});
document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userId = document.getElementById('userId').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;

    const data = {
        name: userName,
        email: userEmail
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('message').innerText = 'Usuário atualizado com sucesso!';
        } else {
            const errorData = await response.json();
            document.getElementById('message').innerText = `Erro ao atualizar usuário: ${errorData.message}`;
        }
    } catch (error) {
        document.getElementById('message').innerText = `Erro ao conectar ao servidor: ${error.message}`;
    }
});