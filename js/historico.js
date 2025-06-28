// js/historico.js
import {
  getFirestore, collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db } from "./firebaseConfig.js";

const auth = getAuth();
const tbody = document.getElementById("tabela-vendas");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const docSnap = await db.collection("usuarios").doc(user.uid).get();
  if (!docSnap.exists || docSnap.data().tipo !== "admin") {
    alert("Acesso restrito a administradores.");
    window.location.href = "funcionario.html";
    return;
  }

  carregarHistorico();
});

function carregarHistorico() {
  const vendasRef = collection(db, "vendas");
  const q = query(vendasRef, orderBy("data", "desc"));

  onSnapshot(q, (snapshot) => {
    tbody.innerHTML = "";
    snapshot.forEach((doc) => {
      const venda = doc.data();
      const tr = document.createElement("tr");

      const data = venda.data.toDate().toLocaleString("pt-BR");

      tr.innerHTML = `
        <td>${venda.nomeProduto}</td>
        <td>${venda.quantidade}</td>
        <td>R$ ${venda.total.toFixed(2)}</td>
        <td>${venda.usuario}</td>
        <td>${data}</td>
      `;

      tbody.appendChild(tr);
    });
  });
}
