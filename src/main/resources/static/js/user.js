document.addEventListener('DOMContentLoaded', loadUserInfo);

async function loadUserInfo() {
    try {
        const response = await fetch('/api/user/info');
        if (!response.ok) {
            console.error("Ошибка при загрузке данных пользователя:", response.statusText);
            return;
        }
        const user = await response.json();

        // Проверка, если роль - это массив, преобразуйте его в строку
        const roles = Array.isArray(user.role) ? user.role.map(r => r.name).join(', ') : user.role;

        // Заполнение таблицы данными о пользователе
        const userInfoRow = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.username}</td>
                <td>${roles}</td>
            </tr>
        `;
        document.querySelector('#user-info').innerHTML = userInfoRow;
    } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
    }
}
