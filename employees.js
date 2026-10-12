const employeeTable = document.getElementById("employeeTable");
const employeeForm = document.getElementById("employeeForm");
const employeeStatus = document.getElementById("employeeStatus");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const orderSelect = document.getElementById("orderSelect");
const cancelBtn = document.getElementById("cancelBtn");

function requireLogin() {
  if (!localStorage.getItem("token")) {
    location.href = "login.html";
    return false;
  }
  return true;
}

async function loadEmployees() {
  if (!requireLogin()) return;

  try {
    const params = new URLSearchParams({
      search: searchInput.value,
      sort: sortSelect.value,
      order: orderSelect.value
    });

    const response = await fetch(`/api/employees?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Could not load employees");

    employeeTable.innerHTML = data.employees.map(emp => `
      <tr>
        <td>${emp.id}</td>
        <td>${escapeHtml(emp.name)}</td>
        <td>${escapeHtml(emp.department)}</td>
        <td>${escapeHtml(emp.role)}</td>
        <td>₹${Number(emp.salary).toLocaleString("en-IN")}</td>
        <td>${String(emp.join_date).slice(0,10)}</td>
        <td>
          <button class="small-btn edit" onclick='editEmployee(${JSON.stringify(emp)})'>Edit</button>
          <button class="small-btn delete" onclick="deleteEmployee(${emp.id})">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    employeeStatus.textContent = error.message;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

window.editEmployee = function(emp) {
  document.getElementById("employeeId").value = emp.id;
  document.getElementById("empName").value = emp.name;
  document.getElementById("empDepartment").value = emp.department;
  document.getElementById("empRole").value = emp.role;
  document.getElementById("empSalary").value = emp.salary;
  document.getElementById("empJoinDate").value = String(emp.join_date).slice(0,10);
  document.getElementById("saveBtn").textContent = "Update Employee";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteEmployee = async function(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Delete failed");

    employeeStatus.textContent = data.message;
    loadEmployees();
  } catch (error) {
    employeeStatus.textContent = error.message;
  }
};

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("employeeId").value;
  const body = {
    name: document.getElementById("empName").value.trim(),
    department: document.getElementById("empDepartment").value.trim(),
    role: document.getElementById("empRole").value.trim(),
    salary: Number(document.getElementById("empSalary").value),
    join_date: document.getElementById("empJoinDate").value
  };

  try {
    const response = await fetch(id ? `/api/employees/${id}` : "/api/employees", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Operation failed");

    employeeStatus.textContent = data.message;
    resetForm();
    loadEmployees();
  } catch (error) {
    employeeStatus.textContent = error.message;
  }
});

function resetForm() {
  employeeForm.reset();
  document.getElementById("employeeId").value = "";
  document.getElementById("saveBtn").textContent = "Add Employee";
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", loadEmployees);
sortSelect.addEventListener("change", loadEmployees);
orderSelect.addEventListener("change", loadEmployees);

const logout = document.getElementById("logoutBtn");
if (logout) logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  location.href = "login.html";
});

loadEmployees();
