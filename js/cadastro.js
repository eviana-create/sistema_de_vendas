// js/cadastro.js
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebaseConfig.js";

const form = document.getElementById("cadastro-form");
const msg = document.getElementById("msg-cadastro");

// ⚠️ Só permite acesso a admins
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const perfilRef = doc(db, "usuarios", user.uid);
  const perfilSnap = await getDoc(perfilRef);

  if (!perfilSnap.exists() || perfilSnap.data().tipo !== "admin") {
    alert("Apenas administradores podem acessar esta página.");
    window.location.href = "funcionario.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const senha = form.senha.value;
  const tipo = form.tipo.value;

  if (!nome || !email || !senha || !tipo) {
    msg.textContent = "Preencha todos os campos.";
    msg.style.color = "red";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const novoUsuario = userCredential.user;

    await setDoc(doc(db, "usuarios", novoUsuario.uid), {
      nome,
      tipo,
      criadoEm: new Date().toISOString()
    });

    msg.textContent = "Usuário cadastrado com sucesso!";
    msg.style.color = "green";
    form.reset();

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    msg.textContent = "Erro: " + error.message;
    msg.style.color = "red";
  }
});
