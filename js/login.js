// js/login.js
import { login, logout } from "./auth.js";

const form = document.getElementById("login-form");
const msgErro = document.getElementById("msg-erro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const senha = form.senha.value;

  const resultado = await login(email, senha);

  if (resultado.success) {
    localStorage.setItem("usuario", email);
    localStorage.setItem("tipoUsuario", resultado.tipo);

    if (resultado.tipo === "admin") {
      window.location.href = "/sistema_de_vendas/admin.html";
    } else if (resultado.tipo === "funcionario") {
      window.location.href = "/sistema_de_vendas/funcionario.html";
    }
  } else {
    msgErro.textContent = resultado.error;
    msgErro.style.display = "block";
  }
});

window.logout = async function () {
  await logout();
  localStorage.clear();
  window.location.href = "/controle-de-vendas/login.html";
};
