document.addEventListener('DOMContentLoaded', () => {
    loadUsersTable();
});

function loadUsersTable() {
    fetch('/api/admin/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевая ошибка: ' + response.statusText);
            }
            return response.json();
        })
        .then(users => {
            const table = document.createElement('table');
            table.className = 'table table-bordered table-striped';
            const headerRow = `<tr>
                <th>ID</th>
                <th>Name</th>
                <th>Last Name</th>
                <th>username</th>
                <th>Age</th>
                <th>Roles</th>
                <th>Actions</th>
            </tr>`;
            table.innerHTML = headerRow;

            users.forEach(user => {
                const role = user.role === 'ROLE_ADMIN' ? 'ADMIN' :
                    user.role === 'ROLE_USER' ? 'USER' :
                        user.role;

                const row = `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${user.username}</td>
                    <td>${user.age}</td>
                    <td>${role}</td>
                    <td>
                        <button onclick="openEditModal(${user.id})" class="btn btn-info">Edit</button>
                        <button onclick="openDeleteModal(${user.id})" class="btn btn-danger">Delete</button>
                    </td>
                </tr>`;
                table.innerHTML += row;
            });

            document.getElementById('main-content').innerHTML = '';
            document.getElementById('main-content').appendChild(table);
        })
        .catch(error => console.error('Ошибка при загрузке пользователей:', error));
}

function toggleUserForm() {
    const formContainer = document.getElementById('addUserFormContainer');
    const tableContainer = document.getElementById('userTableContainer');

    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
        tableContainer.style.display = 'none'; // Скрываем таблицу
    } else {
        formContainer.style.display = 'none';
        tableContainer.style.display = 'block'; // Показываем таблицу
    }
}

function addUser() {
    const newUser = {
        name: document.getElementById('addUserFirstName').value.trim(),
        lastName: document.getElementById('addUserLastName').value.trim(),
        username: document.getElementById('addUserusername').value.trim(),
        age: document.getElementById('addUserAge').value.trim(),
        password: document.getElementById('addUserPassword').value.trim(),
        role: document.getElementById('addUserRole').value.trim() === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'
    };

    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
        .then(response => {
            if (response.ok) {
                loadUsersTable();
                toggleUserForm(); // Переключаем обратно на таблицу
            } else {
                console.error('Ошибка при добавлении пользователя:', response.statusText);
            }
        })
        .catch(error => console.error('Ошибка при добавлении пользователя:', error));
}

function openEditModal(userId) {
    fetch(`/api/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userLastName').value = user.lastName;
            document.getElementById('userusername').value = user.username;
            document.getElementById('userAge').value = user.age;
            document.getElementById('userRole').value = user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER';

            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();

            document.getElementById('editButton').onclick = () => updateUser(userId);
        })
        .catch(error => console.error('Ошибка при загрузке данных пользователя:', error));
}

async function updateUser(userId) {
    const updatedData = {
        name: document.getElementById('userName').value.trim(),
        lastName: document.getElementById('userLastName').value.trim(),
        username: document.getElementById('userusername').value.trim(),
        age: document.getElementById('userAge').value.trim(),
        role: document.getElementById('userRole').value.trim() === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'
    };

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            loadUsersTable();
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
        } else {
            const body = await response.json();
            const alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info || 'Произошла ошибка при обновлении пользователя.'}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            document.querySelector('.modal-body').prepend(alert);
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
    }
}

function openDeleteModal(userId) {
    fetch(`/api/admin/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных пользователя: ' + response.statusText);
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('deleteUserId').value = user.id;
            document.getElementById('deleteUserusername').value = user.username;
            document.getElementById('deleteUserName').value = user.name;
            document.getElementById('deleteUserLastName').value = user.lastName;
            document.getElementById('deleteUserAge').value = user.age;
            document.getElementById('deleteUserRole').value = user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER';

            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        })
        .catch(error => console.error('Ошибка при загрузке пользователя:', error));
}

function deleteUser() {
    const userId = document.getElementById('deleteUserId').value;

    fetch(`/api/admin/delete/${userId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                loadUsersTable();
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                deleteModal.hide();
            } else {
                console.error('Ошибка при удалении пользователя:', response.statusText);
            }
        })
        .catch(error => console.error('Ошибка при удалении пользователя:', error));
}
