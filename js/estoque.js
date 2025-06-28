// js/estoque.js
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db } from "./firebaseConfig.js";

const auth = getAuth();
const lista = document.getElementById("lista-produtos");
const form = document.getElementById("form-produto");
const btnCadastrar = document.getElementById("btn-cadastrar");

// ⚙️ Verifica se é admin ou funcionário
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDocs(collection(db, "usuarios"));
  let tipo = null;

  userDoc.forEach((d) => {
    if (d.id === user.uid) tipo = d.data().tipo;
  });

  if (tipo === "admin") {
    form.style.display = "block";
  }

  carregarProdutos(tipo);
});

async function carregarProdutos(tipoUsuario) {
  const produtosRef = collection(db, "produtos");

  onSnapshot(produtosRef, (snapshot) => {
    lista.innerHTML = "";

    snapshot.forEach(docSnap => {
      const produto = docSnap.data();
      const id = docSnap.id;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>
          ${tipoUsuario === 'admin' ? `<button onclick="excluirProduto('${id}')">❌</button>` : ''}
        </td>
      `;
      lista.appendChild(tr);
    });
  });
}

btnCadastrar?.addEventListener("click", async () => {
  const nome = document.getElementById("nome").value.trim();
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!nome || isNaN(preco) || isNaN(quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    await addDoc(collection(db, "produtos"), { nome, preco, quantidade });
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    alert("Erro ao cadastrar produto.");
  }
});

window.excluirProduto = async function (id) {
  if (confirm("Deseja realmente excluir este produto?")) {
    try {
      await deleteDoc(doc(db, "produtos", id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  }
};
