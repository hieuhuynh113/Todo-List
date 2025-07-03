/*
 * TODO LIST APPLICATION - JAVASCRIPT
 * Ứng dụng quản lý danh sách công việc đơn giản
 * Sử dụng localStorage để lưu trữ dữ liệu
 */

// ===== KHAI BÁO BIẾN VÀ LẤY CÁC ELEMENT TỪ DOM =====
// Lấy các element HTML cần thiết để tương tác
const todoInput = document.getElementById('todoInput');     // Ô input để nhập todo mới
const addBtn = document.getElementById('addBtn');           // Nút thêm todo
const todoList = document.getElementById('todoList');       // Danh sách hiển thị todos
const totalTodos = document.getElementById('totalTodos');   // Hiển thị tổng số todos
const completedTodos = document.getElementById('completedTodos'); // Hiển thị số todos đã hoàn thành

// Mảng lưu trữ tất cả todos trong bộ nhớ
// Mỗi todo sẽ có cấu trúc: {id: number, text: string, completed: boolean}
let todos = [];

// ===== KHỞI TẠO ỨNG DỤNG =====
// Lắng nghe sự kiện khi trang web được tải hoàn toàn
window.addEventListener('load', function() {
    loadTodos();    // Tải dữ liệu từ localStorage
    displayTodos(); // Hiển thị danh sách todos
    updateStats();  // Cập nhật thống kê
});

// ===== THIẾT LẬP CÁC SỰ KIỆN =====
// Lắng nghe sự kiện click vào nút "Thêm"
addBtn.addEventListener('click', addTodo);

// Lắng nghe sự kiện nhấn phím trong ô input
// Khi nhấn Enter thì cũng thêm todo như khi click nút "Thêm"
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {  // Kiểm tra xem phím được nhấn có phải Enter không
        addTodo();            // Gọi hàm thêm todo
    }
});

// ===== CÁC HÀM XỬ LÝ DỮ LIỆU =====

/**
 * Hàm tải dữ liệu todos từ localStorage
 * localStorage lưu trữ dữ liệu dưới dạng string, cần parse thành object
 */
function loadTodos() {
    // Lấy dữ liệu từ localStorage với key 'todos'
    const savedTodos = localStorage.getItem('todos');

    // Kiểm tra xem có dữ liệu đã lưu hay không
    if (savedTodos) {
        // Chuyển đổi từ JSON string thành JavaScript array
        todos = JSON.parse(savedTodos);
    }
    // Nếu không có dữ liệu, todos sẽ giữ nguyên là mảng rỗng []
}

/**
 * Hàm lưu dữ liệu todos vào localStorage
 * Chuyển đổi mảng JavaScript thành JSON string để lưu trữ
 */
function saveTodos() {
    // Chuyển đổi mảng todos thành JSON string và lưu vào localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Hàm thêm todo mới vào danh sách
 * Thực hiện validation, tạo object todo mới, và cập nhật giao diện
 */
function addTodo() {
    // Lấy nội dung từ ô input và loại bỏ khoảng trắng thừa
    const todoText = todoInput.value.trim();

    // Kiểm tra validation: không cho phép thêm todo rỗng
    if (todoText === '') {
        alert('Vui lòng nhập nội dung công việc!');
        return; // Dừng thực hiện hàm nếu input rỗng
    }

    // Tạo object todo mới với cấu trúc chuẩn
    const newTodo = {
        id: Date.now(),        // Sử dụng timestamp làm ID duy nhất (đơn giản)
        text: todoText,        // Nội dung công việc
        completed: false       // Mặc định chưa hoàn thành
    };

    // Thêm todo mới vào cuối mảng todos
    todos.push(newTodo);

    // Lưu dữ liệu mới vào localStorage
    saveTodos();

    // Cập nhật giao diện hiển thị danh sách
    displayTodos();

    // Cập nhật thống kê (tổng số, số hoàn thành)
    updateStats();

    // Xóa nội dung trong ô input để chuẩn bị cho lần nhập tiếp theo
    todoInput.value = '';
}

/**
 * Hàm hiển thị danh sách todos ra giao diện
 * Tạo HTML động cho từng todo item với các nút chức năng
 */
function displayTodos() {
    // Xóa toàn bộ nội dung hiện tại của danh sách
    todoList.innerHTML = '';

    // Kiểm tra nếu không có todo nào
    if (todos.length === 0) {
        // Hiển thị thông báo trống
        todoList.innerHTML = '<li class="empty-state">Chưa có công việc nào. Hãy thêm công việc đầu tiên!</li>';
        return; // Dừng thực hiện hàm
    }

    // Duyệt qua từng todo trong mảng và tạo HTML
    todos.forEach(function(todo) {
        // Tạo element <li> mới cho mỗi todo
        const li = document.createElement('li');
        li.className = 'todo-item'; // Thêm class CSS cơ bản

        // Nếu todo đã hoàn thành, thêm class 'completed' để styling khác biệt
        if (todo.completed) {
            li.classList.add('completed');
        }

        // Tạo HTML nội dung cho todo item
        // Sử dụng template literal (backtick) để dễ dàng nhúng biến
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Xóa</button>
            </div>
        `;

        // Thêm todo item vào danh sách trong DOM
        todoList.appendChild(li);
    });
}

// ===== CÁC HÀM XỬ LÝ CHỨC NĂNG =====

/**
 * Hàm chuyển đổi trạng thái hoàn thành của todo
 * Được gọi khi user click vào checkbox
 * @param {number} id - ID của todo cần thay đổi trạng thái
 */
function toggleTodo(id) {
    // Sử dụng map() để tạo mảng mới với todo được cập nhật
    // map() duyệt qua từng phần tử và trả về mảng mới
    todos = todos.map(function(todo) {
        // Tìm todo có ID trùng khớp
        if (todo.id === id) {
            // Đảo ngược trạng thái completed (true -> false, false -> true)
            todo.completed = !todo.completed;
        }
        return todo; // Trả về todo (đã sửa hoặc không thay đổi)
    });

    // Lưu thay đổi vào localStorage
    saveTodos();
    // Cập nhật giao diện
    displayTodos();
    // Cập nhật thống kê
    updateStats();
}

/**
 * Hàm xóa todo khỏi danh sách
 * Có xác nhận trước khi xóa để tránh xóa nhầm
 * @param {number} id - ID của todo cần xóa
 */
function deleteTodo(id) {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        // Sử dụng filter() để tạo mảng mới loại bỏ todo có ID trùng khớp
        // filter() chỉ giữ lại các phần tử thỏa mãn điều kiện
        todos = todos.filter(function(todo) {
            return todo.id !== id; // Giữ lại todos có ID khác với ID cần xóa
        });

        // Lưu thay đổi vào localStorage
        saveTodos();
        // Cập nhật giao diện
        displayTodos();
        // Cập nhật thống kê
        updateStats();
    }
    // Nếu user chọn Cancel trong confirm, không làm gì cả
}

/**
 * Hàm chỉnh sửa nội dung của todo
 * Sử dụng prompt() để lấy nội dung mới từ user
 * @param {number} id - ID của todo cần chỉnh sửa
 */
function editTodo(id) {
    // Tìm todo cần sửa trong mảng bằng find()
    // find() trả về phần tử đầu tiên thỏa mãn điều kiện, hoặc undefined nếu không tìm thấy
    const todo = todos.find(function(todo) {
        return todo.id === id;
    });

    // Kiểm tra xem có tìm thấy todo không
    if (!todo) return; // Nếu không tìm thấy, dừng thực hiện

    // Hiển thị hộp thoại prompt với nội dung hiện tại làm giá trị mặc định
    const newText = prompt('Sửa nội dung công việc:', todo.text);

    // Kiểm tra user có nhập nội dung mới và không rỗng
    // newText === null nghĩa là user nhấn Cancel
    if (newText !== null && newText.trim() !== '') {
        // Sử dụng map() để cập nhật todo có ID trùng khớp
        todos = todos.map(function(t) {
            if (t.id === id) {
                t.text = newText.trim(); // Cập nhật nội dung mới (đã loại bỏ khoảng trắng thừa)
            }
            return t;
        });

        // Lưu thay đổi vào localStorage
        saveTodos();
        // Cập nhật giao diện
        displayTodos();
    }
    // Nếu user nhấn Cancel hoặc nhập rỗng, không làm gì
}

/**
 * Hàm cập nhật thống kê hiển thị
 * Tính toán và hiển thị tổng số todos và số todos đã hoàn thành
 */
function updateStats() {
    // Tính tổng số todos
    const total = todos.length;

    // Tính số todos đã hoàn thành bằng cách filter các todo có completed = true
    // filter() trả về mảng mới chứa các phần tử thỏa mãn điều kiện
    // .length để lấy số lượng phần tử trong mảng kết quả
    const completed = todos.filter(function(todo) {
        return todo.completed; // Chỉ giữ lại todos đã hoàn thành
    }).length;

    // Cập nhật nội dung hiển thị trên giao diện
    totalTodos.textContent = `Tổng: ${total}`;
    completedTodos.textContent = `Hoàn thành: ${completed}`;
}
