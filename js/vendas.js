// js/vendas.js
import {
  getFirestore, collection, getDocs, addDoc, doc, updateDoc, Timestamp, onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db } from "./firebaseConfig.js";

const auth = getAuth();
const produtoSelect = document.getElementById("produto");
const form = document.getElementById("venda-form");
const totalDiaSpan = document.getElementById("total-dia");

let produtos = [];
let usuario = null;

// ⚙️ Verifica login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  usuario = user;
  await carregarProdutos();
  calcularTotalDia();
});

// 🧾 Carrega produtos no select
async function carregarProdutos() {
  const produtosSnap = await getDocs(collection(db, "produtos"));
  produtoSelect.innerHTML = "";

  produtos = [];
  produtosSnap.forEach((docSnap) => {
    const produto = { id: docSnap.id, ...docSnap.data() };
    produtos.push(produto);

    const option = document.createElement("option");
    option.value = produto.id;
    option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (Estoque: ${produto.quantidade})`;
    produtoSelect.appendChild(option);
  });
}

// 🧮 Total do dia
function calcularTotalDia() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vendasRef = collection(db, "vendas");
  const q = query(vendasRef, where("data", ">=", Timestamp.fromDate(hoje)));

  onSnapshot(q, (snapshot) => {
    let total = 0;
    snapshot.forEach((doc) => {
      total += doc.data().total;
    });
    totalDiaSpan.textContent = total.toFixed(2);
  });
}

// 📝 Registrar venda
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produtoId = produtoSelect.value;
  const qtdVendida = parseInt(document.getElementById("quantidade").value);

  const produto = produtos.find(p => p.id === produtoId);
  if (!produto || isNaN(qtdVendida) || qtdVendida <= 0) {
    alert("Selecione um produto válido e quantidade positiva.");
    return;
  }

  if (qtdVendida > produto.quantidade) {
    alert("Estoque insuficiente.");
    return;
  }

  const total = qtdVendida * produto.preco;

  try {
    await addDoc(collection(db, "vendas"), {
      produtoId,
      nomeProduto: produto.nome,
      quantidade: qtdVendida,
      total,
      data: Timestamp.now(),
      usuario: usuario.email
    });

    // Atualiza o estoque
    const novoEstoque = produto.quantidade - qtdVendida;
    await updateDoc(doc(db, "produtos", produtoId), {
      quantidade: novoEstoque
    });

    alert("Venda registrada com sucesso!");
    form.reset();
    carregarProdutos(); // atualiza o estoque visível
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    alert("Erro ao registrar venda.");
  }
});
